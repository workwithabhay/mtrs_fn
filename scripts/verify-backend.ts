import { checkBackendHealth } from '../src/lib/api/health';
import { config } from '../src/lib/config/env';

async function main() {
  console.log('🔍 Review Management SaaS - Backend Connectivity Probe');
  console.log(`📡 Configured Base API URL : ${config.apiUrl}`);
  console.log(`🏥 Health Probe Target     : ${config.backendBaseUrl}/api/health\n`);

  const result = await checkBackendHealth(3000);

  if (result.isReachable) {
    console.log('✅ Backend is ONLINE and REACHABLE!');
    console.log(`   - Status      : ${result.status}`);
    console.log(`   - Environment : ${result.environment}`);
    console.log(`   - Uptime      : ${result.uptimeSeconds}s`);
    console.log(`   - Latency     : ${result.latencyMs}ms`);
    process.exit(0);
  } else {
    console.log('⚠️  Backend is currently UNREACHABLE or STANDBY');
    console.log(`   - Error   : ${result.error || 'Connection failed'}`);
    console.log(`   - Latency : ${result.latencyMs}ms`);
    console.log('\n💡 To start the backend locally:');
    console.log('   cd ../backend && npm run dev\n');
    process.exit(0); // Exit cleanly so build or CI does not fail when backend is not running locally
  }
}

main().catch((err) => {
  console.error('Fatal probe error:', err);
  process.exit(1);
});
