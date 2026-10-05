import http from 'http';
import fs from 'fs';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function verifyAllImports() {
  console.log('Fetching router...');
  const routerRes = await fetchUrl('http://localhost:5174/src/router/AppRouter.jsx');
  if (routerRes.status !== 200) {
    console.error('Failed to fetch AppRouter:', routerRes.status, routerRes.body);
    process.exit(1);
  }

  // Extract all imported modules from AppRouter
  const lines = routerRes.body.split('\n');
  const importLines = lines.filter(l => l.startsWith('import ') && l.includes(' from '));
  const modulePaths = [];

  for (const line of importLines) {
    const match = line.match(/from\s+["']([^"']+)["']/);
    if (match && match[1].startsWith('/src/')) {
      modulePaths.push(match[1]);
    }
  }

  console.log(`Found ${modulePaths.length} imported src modules in AppRouter. Testing each against Vite dev server...`);

  let failed = 0;
  for (const mod of modulePaths) {
    try {
      const res = await fetchUrl(`http://localhost:5174${mod}`);
      if (res.status !== 200 || res.body.includes('Internal server error') || res.body.includes('[plugin:vite:')) {
        console.error(`❌ Module FAILED: ${mod} (Status: ${res.status})`);
        console.error(res.body.slice(0, 300));
        failed++;
      } else {
        // also check if body has syntax error payload
        if (res.body.includes('vite:error')) {
          console.error(`❌ Vite error in ${mod}:`, res.body.slice(0, 300));
          failed++;
        }
      }
    } catch (err) {
      console.error(`❌ Network error fetching ${mod}:`, err.message);
      failed++;
    }
  }

  // Also check services
  const services = [
    '/src/features/vendors/vendorService.js',
    '/src/features/purchaseOrders/purchaseOrderService.js',
    '/src/features/purchaseBills/purchaseBillService.js',
    '/src/features/commercialAdjustments/services/creditNoteService.js',
    '/src/features/commercialAdjustments/services/debitNoteService.js',
    '/src/features/advances/services/advanceService.js',
    '/src/features/gst/services/gstService.js',
    '/src/features/gst/services/einvoiceService.js',
    '/src/features/banking/services/bankReconciliationService.js',
    '/src/features/reports/services/ageingReportService.js'
  ];

  console.log(`Testing ${services.length} services against Vite dev server...`);
  for (const s of services) {
    const res = await fetchUrl(`http://localhost:5174${s}`);
    if (res.status !== 200 || res.body.includes('Internal server error')) {
      console.error(`❌ Service FAILED: ${s} (Status: ${res.status})`);
      failed++;
    } else {
      console.log(`✓ Service OK: ${s}`);
    }
  }

  if (failed === 0) {
    console.log(`\n🎉 SUCCESS: All ${modulePaths.length} UI components and ${services.length} services compiled and served with HTTP 200 OK by Vite!`);
  } else {
    console.error(`\n❌ Total failures: ${failed}`);
    process.exit(1);
  }
}

verifyAllImports().catch(err => {
  console.error(err);
  process.exit(1);
});
