import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — EMPLOYEE SERVICE
 * 
 * Production data layer for Employee Master & Multi-Company Assignments.
 * Communicates with PostgreSQL via Supabase RLS.
 */

export const EMPLOYMENT_TYPES = Object.freeze([
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'intern', label: 'Intern' },
  { value: 'consultant', label: 'Consultant' }
]);

export const EMPLOYEE_STATUSES = Object.freeze([
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]);

export const STANDARD_DEPARTMENTS = Object.freeze([
  'Executive / Management',
  'Engineering & IT',
  'Operations & CSC',
  'Customer Advocacy',
  'Finance & Accounts',
  'Sales & Marketing',
  'Logistics & Travel',
  'Retail & Servicing',
  'Legal & Compliance'
]);

export const STANDARD_DESIGNATIONS = Object.freeze([
  'Managing Director',
  'General Manager',
  'Branch Manager',
  'Senior Software Engineer',
  'Operations Lead',
  'CSC Kiosk Executive',
  'Insurance Specialist',
  'Compliance Officer',
  'Tour Operations Coordinator',
  'Hardware Technician',
  'Customer Support Associate'
]);

/**
 * Fetch employees list with filtering, company scoping, and pagination
 */
export async function getEmployees({
  companyId = null,
  isAllCompanies = false,
  search = '',
  department = 'all',
  designation = 'all',
  employmentType = 'all',
  status = 'active',
  page = 1,
  pageSize = 25
} = {}) {
  if (!isSupabaseConfigured) {
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('employees')
      .select(`
        id,
        employee_code,
        first_name,
        middle_name,
        last_name,
        full_name,
        email,
        phone,
        department,
        designation,
        employment_type,
        status,
        joining_date,
        profile_photo_url,
        created_at,
        assignments:employee_company_assignments (
          id,
          company_id,
          designation,
          department,
          is_primary,
          is_active,
          company:companies (
            id,
            name,
            slug
          )
        )
      `, { count: 'exact' });

    // Status filter
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Employment type filter
    if (employmentType !== 'all') {
      query = query.eq('employment_type', employmentType);
    }

    // Department filter
    if (department !== 'all') {
      query = query.eq('department', department);
    }

    // Designation filter
    if (designation !== 'all') {
      query = query.eq('designation', designation);
    }

    // Search query (code, name, email, phone)
    if (search && search.trim()) {
      const q = search.trim();
      query = query.or(`employee_code.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,designation.ilike.%${q}%,department.ilike.%${q}%`);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.warn('[employeeService] getEmployees error:', error.message);
      throw error;
    }

    let records = data || [];

    // Filter by companyId if not in All Companies mode
    if (!isAllCompanies && companyId) {
      records = records.filter((emp) => {
        return Array.isArray(emp.assignments) && emp.assignments.some(
          (a) => a.company_id === companyId && a.is_active !== false
        );
      });
    }

    const totalCount = count !== null ? count : records.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      data: records,
      count: totalCount,
      page,
      pageSize,
      totalPages
    };
  } catch (err) {
    console.warn('[employeeService] getEmployees exception:', err);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }
}

/**
 * Fetch a single employee by UUID or employee code with full relational graph
 */
export async function getEmployeeById(employeeId) {
  if (!employeeId || !isSupabaseConfigured) return null;

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(employeeId);

    let query = supabase
      .from('employees')
      .select(`
        id,
        employee_code,
        first_name,
        middle_name,
        last_name,
        full_name,
        email,
        phone,
        alternate_phone,
        date_of_birth,
        gender,
        joining_date,
        employment_type,
        department,
        designation,
        reporting_manager_id,
        address,
        city,
        state,
        postal_code,
        profile_photo_url,
        status,
        notes,
        created_at,
        updated_at,
        created_by,
        reporting_manager:employees!reporting_manager_id (
          id,
          employee_code,
          first_name,
          last_name,
          designation
        ),
        assignments:employee_company_assignments (
          id,
          company_id,
          designation,
          department,
          employment_type,
          joining_date,
          reporting_manager_id,
          is_primary,
          is_active,
          created_at,
          company:companies (
            id,
            name,
            slug,
            domain:domains (
              id,
              name,
              slug
            )
          )
        )
      `);

    if (isUuid) {
      query = query.eq('id', employeeId);
    } else {
      query = query.eq('employee_code', employeeId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.warn('[employeeService] getEmployeeById error:', error.message);
      return null;
    }

    return data || null;
  } catch (err) {
    console.warn('[employeeService] getEmployeeById exception:', err);
    return null;
  }
}

/**
 * Create a new employee record and initial company assignment
 */
export async function createEmployee(employeePayload, initialCompanyAssignment) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase client is not configured.');
  }

  // 1. Validation
  if (!employeePayload.first_name?.trim()) {
    throw new Error('First name is required.');
  }
  if (!employeePayload.last_name?.trim()) {
    throw new Error('Last name is required.');
  }
  if (!initialCompanyAssignment?.company_id) {
    throw new Error('Primary company assignment is required.');
  }

  // 2. Insert Employee
  const { data: emp, error: empErr } = await supabase
    .from('employees')
    .insert([
      {
        first_name: employeePayload.first_name.trim(),
        middle_name: employeePayload.middle_name?.trim() || null,
        last_name: employeePayload.last_name.trim(),
        email: employeePayload.email?.trim() || null,
        phone: employeePayload.phone?.trim() || null,
        alternate_phone: employeePayload.alternate_phone?.trim() || null,
        date_of_birth: employeePayload.date_of_birth || null,
        gender: employeePayload.gender || null,
        joining_date: employeePayload.joining_date || new Date().toISOString().split('T')[0],
        employment_type: employeePayload.employment_type || 'full_time',
        department: employeePayload.department || null,
        designation: employeePayload.designation || null,
        reporting_manager_id: employeePayload.reporting_manager_id || null,
        address: employeePayload.address?.trim() || null,
        city: employeePayload.city?.trim() || null,
        state: employeePayload.state?.trim() || null,
        postal_code: employeePayload.postal_code?.trim() || null,
        profile_photo_url: employeePayload.profile_photo_url?.trim() || null,
        status: employeePayload.status || 'active',
        notes: employeePayload.notes?.trim() || null
      }
    ])
    .select()
    .single();

  if (empErr) {
    console.warn('[employeeService] createEmployee error:', empErr.message);
    throw new Error(empErr.message || 'Failed to create employee record.');
  }

  // 3. Insert Initial Company Assignment
  const { error: assignErr } = await supabase
    .from('employee_company_assignments')
    .insert([
      {
        employee_id: emp.id,
        company_id: initialCompanyAssignment.company_id,
        designation: initialCompanyAssignment.designation || emp.designation,
        department: initialCompanyAssignment.department || emp.department,
        employment_type: initialCompanyAssignment.employment_type || emp.employment_type,
        joining_date: initialCompanyAssignment.joining_date || emp.joining_date,
        reporting_manager_id: initialCompanyAssignment.reporting_manager_id || emp.reporting_manager_id,
        is_primary: true,
        is_active: true
      }
    ]);

  if (assignErr) {
    console.warn('[employeeService] createEmployee company assignment error:', assignErr.message);
    // If company assignment fails, employee record is still saved; inform user
    throw new Error(`Employee created, but company assignment failed: ${assignErr.message}`);
  }

  return emp;
}

/**
 * Update an existing employee record
 */
export async function updateEmployee(employeeId, updates) {
  if (!employeeId || !isSupabaseConfigured) {
    throw new Error('Supabase client is not configured.');
  }

  // Prevent self-reference for reporting manager
  if (updates.reporting_manager_id && updates.reporting_manager_id === employeeId) {
    throw new Error('An employee cannot be their own reporting manager.');
  }

  const payload = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('employees')
    .update(payload)
    .eq('id', employeeId)
    .select()
    .single();

  if (error) {
    console.warn('[employeeService] updateEmployee error:', error.message);
    throw new Error(error.message || 'Failed to update employee details.');
  }

  return data;
}

/**
 * Soft deactivate an employee
 */
export async function deactivateEmployee(employeeId) {
  return await updateEmployee(employeeId, { status: 'inactive' });
}

/**
 * Reactivate an employee
 */
export async function reactivateEmployee(employeeId) {
  return await updateEmployee(employeeId, { status: 'active' });
}

/**
 * Assign employee to an additional company
 */
export async function assignEmployeeToCompany({
  employee_id,
  company_id,
  designation = null,
  department = null,
  employment_type = 'full_time',
  joining_date = null,
  reporting_manager_id = null,
  is_primary = false
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase client is not configured.');

  // Check if active assignment already exists for this company
  const { data: existing } = await supabase
    .from('employee_company_assignments')
    .select('id, is_active')
    .eq('employee_id', employee_id)
    .eq('company_id', company_id)
    .maybeSingle();

  if (existing) {
    if (existing.is_active) {
      throw new Error('This employee is already actively assigned to this company.');
    } else {
      // Reactivate existing assignment
      const { data, error } = await supabase
        .from('employee_company_assignments')
        .update({
          is_active: true,
          designation,
          department,
          employment_type,
          is_primary,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // If new assignment is marked primary, unmark other primary assignments
  if (is_primary) {
    await supabase
      .from('employee_company_assignments')
      .update({ is_primary: false })
      .eq('employee_id', employee_id);
  }

  const { data, error } = await supabase
    .from('employee_company_assignments')
    .insert([
      {
        employee_id,
        company_id,
        designation,
        department,
        employment_type,
        joining_date: joining_date || new Date().toISOString().split('T')[0],
        reporting_manager_id,
        is_primary,
        is_active: true
      }
    ])
    .select()
    .single();

  if (error) {
    console.warn('[employeeService] assignEmployeeToCompany error:', error.message);
    throw new Error(error.message || 'Failed to assign company.');
  }

  return data;
}

/**
 * Remove or deactivate a company assignment
 */
export async function removeEmployeeCompanyAssignment(assignmentId) {
  if (!isSupabaseConfigured) throw new Error('Supabase client is not configured.');

  const { error } = await supabase
    .from('employee_company_assignments')
    .update({ is_active: false })
    .eq('id', assignmentId);

  if (error) {
    console.warn('[employeeService] removeEmployeeCompanyAssignment error:', error.message);
    throw error;
  }

  return true;
}

/**
 * Set a company assignment as primary
 */
export async function setPrimaryCompanyAssignment(employeeId, assignmentId) {
  if (!isSupabaseConfigured) throw new Error('Supabase client is not configured.');

  // Unmark all
  await supabase
    .from('employee_company_assignments')
    .update({ is_primary: false })
    .eq('employee_id', employeeId);

  // Mark selected
  const { data, error } = await supabase
    .from('employee_company_assignments')
    .update({ is_primary: true })
    .eq('id', assignmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch potential reporting managers within company scope (excluding self)
 */
export async function getPotentialManagers({ companyId = null, excludeEmployeeId = null } = {}) {
  if (!isSupabaseConfigured) return [];

  try {
    if (companyId) {
      const { data: assignments, error: assignError } = await supabase
        .from('employee_company_assignments')
        .select('employee_id')
        .eq('company_id', companyId)
        .eq('is_active', true);

      if (!assignError && assignments && assignments.length > 0) {
        const employeeIds = assignments.map(a => a.employee_id).filter(id => id !== excludeEmployeeId);
        if (employeeIds.length === 0) return [];

        const { data, error } = await supabase
          .from('employees')
          .select('id, employee_code, first_name, last_name, designation, department')
          .in('id', employeeIds)
          .eq('status', 'active')
          .order('first_name', { ascending: true });

        if (!error && data) return data;
      }
    }

    let query = supabase
      .from('employees')
      .select('id, employee_code, first_name, last_name, designation, department')
      .eq('status', 'active');

    if (excludeEmployeeId) {
      query = query.neq('id', excludeEmployeeId);
    }

    const { data, error } = await query.order('first_name', { ascending: true });

    if (error) {
      console.warn('[employeeService] getPotentialManagers error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn('[employeeService] getPotentialManagers exception:', err);
    return [];
  }
}
