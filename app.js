const express = require('express');
const { URL } = require('url');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_CONNECTION = process.env.DB_CONNECTION || 'not configured';

// Health check functions
function checkDatabaseHealth() {
  if (DB_CONNECTION === 'not configured') {
    return { status: 'unhealthy', message: 'Database not configured' };
  }
  
  try {
    const dbUrl = new URL(DB_CONNECTION);
    return { status: 'healthy', message: `Connected to ${dbUrl.hostname}:${dbUrl.port}` };
  } catch (error) {
    return { status: 'unhealthy', message: 'Invalid database connection string' };
  }
}

function getSystemHealth() {
  const dbHealth = checkDatabaseHealth();
  const overallHealth = dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy';
  
  return {
    overall: overallHealth,
    database: dbHealth,
    port: { status: 'healthy', message: `Listening on port ${PORT}` },
    timestamp: new Date().toISOString()
  };
}

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  const health = getSystemHealth();
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World App</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="container">
        <div class="emoji">🚀</div>
        <h1>Hello World!</h1>
        <p class="description">Welcome to our containerized Node.js application running on AWS ECS Fargate</p>
        
        <div class="status-table">
            <table>
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Status</th>
                        <th>Details</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="row-${health.database.status}">
                        <td><strong>🗄️ Database</strong></td>
                        <td><span class="badge badge-${health.database.status}">${health.database.status}</span></td>
                        <td class="details">${DB_CONNECTION}</td>
                        <td class="message">${health.database.message}</td>
                    </tr>
                    <tr class="row-${health.port.status}">
                        <td><strong>🌐 Port</strong></td>
                        <td><span class="badge badge-${health.port.status}">${health.port.status}</span></td>
                        <td class="details">${PORT}</td>
                        <td class="message">Service listening</td>
                    </tr>
                    <tr class="row-healthy">
                        <td><strong>⏰ Timestamp</strong></td>
                        <td><span class="badge badge-info">active</span></td>
                        <td class="details">${new Date().toISOString()}</td>
                        <td class="message">Current server time</td>
                    </tr>
                    <tr class="row-healthy">
                        <td><strong>📦 Version</strong></td>
                        <td><span class="badge badge-info">1.0.0</span></td>
                        <td class="details">Node.js App</td>
                        <td class="message">Application version</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="status status-${health.overall}">
            ${health.overall === 'healthy' ? '✅ All Services Healthy' : '❌ Service Issues Detected'}
        </div>
    </div>
</body>
</html>
  `;
  
  res.send(html);
});



app.get('/health', (req, res) => {
  const health = getSystemHealth();
  res.status(health.overall === 'healthy' ? 200 : 503).json(health);
});

app.get('/api', (req, res) => {
  const health = getSystemHealth();
  res.json({
    message: 'Hello World!',
    database: DB_CONNECTION,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    port: PORT,
    health
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${DB_CONNECTION}`);
});
