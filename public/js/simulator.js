// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 1. 验证参数是否传递成功
  if (!window.simulationData) {
    console.error('No simulation data found! 未获取到模拟参数');
    return;
  }
  const data = window.simulationData;
  
  // 2. 获取可视化容器
  const container = document.getElementById('sim-container');
  if (!container) {
    console.error('Simulation container not found! 未找到可视化容器');
    return;
  }

  // 3. Three.js基础初始化
  // 场景
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f8ff); // 浅蓝背景
  
  // 相机（透视相机，适配容器尺寸）
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 5, 15); // 调整相机位置，方便观察
  camera.lookAt(0, 0, 0); // 相机看向场景中心
  
  // 渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true }); // 抗锯齿
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true; // 开启阴影，更真实
  container.appendChild(renderer.domElement);

  // 4. 添加辅助元素（坐标系+光源）
  // 坐标系（x红/y绿/z蓝，长度10）
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);
  
  // 环境光（照亮整个场景）
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  
  // 方向光（模拟太阳光，产生阴影）
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // 5. 绘制流体容器（简化的长方体）
  // 容器几何体（尺寸根据流体高度调整）
  const containerGeometry = new THREE.BoxGeometry(8, data.height, 8);
  // 透明材质（只显示线框，能看到内部流体）
  const containerMaterial = new THREE.MeshBasicMaterial({
    color: 0x444488,
    wireframe: true,
    transparent: true,
    opacity: 0.5
  });
  const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial);
  containerMesh.position.y = data.height / 2; // 容器底部贴地
  scene.add(containerMesh);

  // 6. 流体粒子系统（核心：根据流速/流量生成粒子）
  const particleCount = Math.floor(data.flowRate * 5000); // 流量越大，粒子越多（适配）
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3); // 每个粒子3个坐标
  const colors = new Float32Array(particleCount * 3); // 每个粒子3个颜色值
  
  // 初始化粒子位置和颜色
  const color = new THREE.Color();
  for (let i = 0; i < particleCount * 3; i += 3) {
    // 位置：容器内随机分布，y轴从0到流体高度
    positions[i] = (Math.random() - 0.5) * 7; // x轴（-3.5到3.5）
    positions[i + 1] = Math.random() * data.height; // y轴（0到流体高度）
    positions[i + 2] = (Math.random() - 0.5) * 7; // z轴（-3.5到3.5）
    
    // 颜色：根据高度渐变（浅蓝→深蓝）
    const heightRatio = positions[i + 1] / data.height;
    color.setHSL(0.6, 0.8, 0.4 + heightRatio * 0.4); // 蓝色系渐变
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }
  
  // 设置粒子属性
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // 粒子材质（带颜色+大小）
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true, // 使用粒子自身颜色
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true // 距离越远，粒子越小
  });
  
  // 创建粒子系统（流体）
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // 7. 窗口大小适配（响应式）
  window.addEventListener('resize', function() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // 8. 动画循环（让流体粒子动起来，模拟流动）
  function animate() {
    requestAnimationFrame(animate);
    
    // 获取粒子位置数组
    const positions = particles.geometry.attributes.position.array;
    // 流速因子（控制粒子移动速度）
    const velocityFactor = data.velocity / 10;
    
    // 更新每个粒子的位置（模拟向下流动+水平扩散）
    for (let i = 0; i < positions.length; i += 3) {
      // y轴向下移动（模拟重力）
      positions[i + 1] -= velocityFactor * 0.05;
      // 超出容器底部后，回到顶部重新流动
      if (positions[i + 1] < 0) {
        positions[i + 1] = data.height;
        positions[i] = (Math.random() - 0.5) * 7; // 重新随机x位置
        positions[i + 2] = (Math.random() - 0.5) * 7; // 重新随机z位置
      }
      
      // 水平微小晃动（模拟流体扰动）
      positions[i] += (Math.random() - 0.5) * velocityFactor * 0.02;
      positions[i + 2] += (Math.random() - 0.5) * velocityFactor * 0.02;
    }
    
    // 告诉Three.js更新粒子位置
    particles.geometry.attributes.position.needsUpdate = true;
    
    // 缓慢旋转场景，方便观察
    particles.rotation.y += 0.002;
    containerMesh.rotation.y += 0.001;
    
    // 渲染场景
    renderer.render(scene, camera);
  }

  // 启动动画循环
  animate();
});