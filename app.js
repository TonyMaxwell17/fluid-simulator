const express = require('express');
const path = require('path'); // 新增：处理跨平台路径
const app = express();
const port = 3000;

// 配置EJS模板引擎（优化路径，避免Windows/Mac路径问题）
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // 用__dirname确保路径正确

// 静态资源目录（前端JS/样式等）
app.use(express.static(path.join(__dirname, 'public')));

// 解析表单/JSON数据
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 首页：参数输入表单
app.get('/', (req, res) => {
  res.render('index', {
    title: 'HVAC Backflow Aerodynamics Visualization',
    message: 'Enter Torricelli Equation Parameters'
  });
});

// 计算路由：处理表单提交，返回结果+可视化
app.post('/calculate', (req, res) => {
  const { height, density, gravity, area } = req.body;
  
  // 转换为数字（加容错，避免空值报错）
  const h = parseFloat(height) || 10; // 默认值10
  const ρ = parseFloat(density) || 1000; // 水的密度，默认1000kg/m³
  const g = parseFloat(gravity) || 9.81; // 重力加速度，默认9.81m/s²
  const A = parseFloat(area) || 0.01; // 截面积，默认0.01m²
  
  // 托里拆利方程计算流速：v = √(2gh)
  const velocity = Math.sqrt(2 * g * h);
  // 流量：Q = A * v
  const flowRate = A * velocity;
  // 伯努利方程计算压力（简化版）
  const pressure = 0.5 * ρ * velocity * velocity;
  
  // 生成可视化数据点（用于Three.js渲染）
  const dataPoints = [];
  for (let i = 0; i <= 10; i++) {
    const currentHeight = h * (i / 10);
    const currentVelocity = Math.sqrt(2 * g * currentHeight);
    const currentFlowRate = A * currentVelocity;
    dataPoints.push({
      height: currentHeight,
      velocity: currentVelocity,
      flowRate: currentFlowRate
    });
  }
  
  res.render('result', {
    title: 'Calculation Results',
    height: h,
    density: ρ,
    gravity: g,
    area: A,
    velocity: velocity.toFixed(2), // 保留2位小数，更易读
    flowRate: flowRate.toFixed(4),
    pressure: pressure.toFixed(2),
    dataPoints: dataPoints // 传递给前端可视化
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});