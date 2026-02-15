import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 中国主要城市数据（坐标已调整为适合 3D 展示的位置，包含台湾）
const CITIES = [
    // 直辖市
    { name: '北京', lat: 39.9042, lon: 116.4074, x: 0.32, y: 0.75, z: 0 },
    { name: '上海', lat: 31.2304, lon: 121.4737, x: 0.82, y: 0.12, z: 0.1 },
    { name: '天津', lat: 39.0842, lon: 117.2009, x: 0.42, y: 0.68, z: 0 },
    { name: '重庆', lat: 29.5630, lon: 106.5516, x: 0.05, y: -0.05, z: 0.1 },
    
    // 省会及主要城市 - 东北
    { name: '哈尔滨', lat: 45.8038, lon: 126.5350, x: 1.05, y: 1.25, z: 0 },
    { name: '沈阳', lat: 41.8057, lon: 123.4315, x: 0.92, y: 0.92, z: 0 },
    { name: '大连', lat: 38.9140, lon: 121.6147, x: 0.88, y: 0.68, z: 0.3 },
    { name: '长春', lat: 43.8171, lon: 125.3235, x: 1.0, y: 1.08, z: 0 },
    
    // 华北
    { name: '石家庄', lat: 38.0428, lon: 114.5149, x: 0.32, y: 0.58, z: 0 },
    { name: '太原', lat: 37.8706, lon: 112.5489, x: 0.28, y: 0.48, z: 0 },
    { name: '济南', lat: 36.6512, lon: 117.1201, x: 0.58, y: 0.48, z: 0.1 },
    { name: '青岛', lat: 36.0671, lon: 120.3826, x: 0.78, y: 0.45, z: 0.2 },
    { name: '郑州', lat: 34.7659, lon: 113.6841, x: 0.38, y: 0.38, z: 0 },
    
    // 华东
    { name: '南京', lat: 32.0603, lon: 118.7969, x: 0.72, y: 0.22, z: 0.1 },
    { name: '杭州', lat: 30.2741, lon: 120.1551, x: 0.78, y: 0.08, z: 0.1 },
    { name: '苏州', lat: 31.2989, lon: 120.5853, x: 0.8, y: 0.15, z: 0.1 },
    { name: '合肥', lat: 31.8206, lon: 117.2272, x: 0.62, y: 0.25, z: 0.05 },
    { name: '南昌', lat: 28.6820, lon: 115.8579, x: 0.62, y: -0.08, z: 0.05 },
    { name: '福州', lat: 26.0745, lon: 119.2965, x: 0.75, y: -0.22, z: 0.15 },
    { name: '厦门', lat: 24.4798, lon: 118.0894, x: 0.68, y: -0.32, z: 0.15 },
    
    // 台湾
    { name: '台北', lat: 25.0330, lon: 121.5654, x: 0.9, y: -0.15, z: 0.1 },
    { name: '高雄', lat: 22.6273, lon: 120.3014, x: 0.9, y: -0.22, z: 0.1 },
    
    // 华中
    { name: '武汉', lat: 30.5928, lon: 114.3055, x: 0.52, y: 0.05, z: 0.05 },
    { name: '长沙', lat: 28.2280, lon: 112.9388, x: 0.48, y: -0.15, z: 0.05 },
    
    // 华南
    { name: '广州', lat: 23.1291, lon: 113.2644, x: 0.55, y: -0.55, z: 0.1 },
    { name: '深圳', lat: 22.5431, lon: 114.0579, x: 0.6, y: -0.6, z: 0.1 },
    { name: '南宁', lat: 22.8170, lon: 108.3665, x: 0.25, y: -0.55, z: 0.05 },
    
    // 海南
    { name: '海口', lat: 20.0174, lon: 110.3492, x: 0.42, y: -0.75, z: 0.1 },
    { name: '三亚', lat: 18.2528, lon: 109.5120, x: 0.4, y: -0.82, z: 0.1 },
    
    // 西南
    { name: '成都', lat: 30.5728, lon: 104.0668, x: -0.05, y: 0.05, z: 0 },
    { name: '贵阳', lat: 26.6470, lon: 106.6302, x: 0.08, y: -0.3, z: 0 },
    { name: '昆明', lat: 25.0389, lon: 102.7183, x: -0.2, y: -0.42, z: 0 },
    { name: '拉萨', lat: 29.6500, lon: 91.1000, x: -0.55, y: -0.05, z: 0.3 },
    
    // 西北
    { name: '西安', lat: 34.3416, lon: 108.9398, x: 0.05, y: 0.35, z: 0 },
    { name: '兰州', lat: 36.0611, lon: 103.8343, x: -0.12, y: 0.45, z: 0 },
    { name: '西宁', lat: 36.6171, lon: 101.7782, x: -0.22, y: 0.48, z: 0 },
    { name: '银川', lat: 38.4872, lon: 106.2309, x: -0.02, y: 0.65, z: 0 },
    { name: '乌鲁木齐', lat: 43.8256, lon: 87.6168, x: -0.78, y: 0.85, z: 0 },
    
    // 内蒙古
    { name: '呼和浩特', lat: 40.8414, lon: 111.7519, x: 0.42, y: 0.82, z: 0 }
];

// WMO 天气代码映射
const WEATHER_CODES = {
    0: { name: '晴朗', icon: '☀️', type: 'sunny', color: 0xffd700 },
    1: { name: '多云', icon: '🌤️', type: 'sunny', color: 0xffd700 },
    2: { name: '多云', icon: '⛅', type: 'cloudy', color: 0xa0a0a0 },
    3: { name: '阴天', icon: '☁️', type: 'cloudy', color: 0x808080 },
    45: { name: '雾', icon: '🌫️', type: 'cloudy', color: 0x909090 },
    48: { name: '雾凇', icon: '🌫️', type: 'cloudy', color: 0x909090 },
    51: { name: '小雨', icon: '🌦️', type: 'rainy', color: 0x00d4ff },
    53: { name: '中雨', icon: '🌧️', type: 'rainy', color: 0x00a0ff },
    55: { name: '大雨', icon: '🌧️', type: 'rainy', color: 0x0080ff },
    56: { name: '冻雨', icon: '🌨️', type: 'rainy', color: 0x80c0ff },
    57: { name: '冻雨', icon: '🌨️', type: 'rainy', color: 0x80c0ff },
    61: { name: '小雨', icon: '🌦️', type: 'rainy', color: 0x00d4ff },
    63: { name: '中雨', icon: '🌧️', type: 'rainy', color: 0x00a0ff },
    65: { name: '大雨', icon: '🌧️', type: 'rainy', color: 0x0080ff },
    66: { name: '冻雨', icon: '🌨️', type: 'rainy', color: 0x80c0ff },
    67: { name: '冻雨', icon: '🌨️', type: 'rainy', color: 0x80c0ff },
    71: { name: '小雪', icon: '🌨️', type: 'snowy', color: 0xffffff },
    73: { name: '中雪', icon: '❄️', type: 'snowy', color: 0xffffff },
    75: { name: '大雪', icon: '❄️', type: 'snowy', color: 0xffffff },
    77: { name: '雪粒', icon: '🌨️', type: 'snowy', color: 0xffffff },
    80: { name: '阵雨', icon: '🌦️', type: 'rainy', color: 0x00d4ff },
    81: { name: '强阵雨', icon: '🌧️', type: 'rainy', color: 0x00a0ff },
    82: { name: '暴雨', icon: '⛈️', type: 'rainy', color: 0x0080ff },
    85: { name: '阵雪', icon: '🌨️', type: 'snowy', color: 0xffffff },
    86: { name: '强阵雪', icon: '❄️', type: 'snowy', color: 0xffffff },
    95: { name: '雷雨', icon: '⛈️', type: 'rainy', color: 0x7b2ff7 },
    96: { name: '雷雨伴冰雹', icon: '⛈️', type: 'rainy', color: 0x7b2ff7 },
    99: { name: '强雷雨伴冰雹', icon: '⛈️', type: 'rainy', color: 0x7b2ff7 }
};

// 主类
class WeatherMap {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.cityMeshes = [];
        this.particleSystems = {};
        this.weatherData = {};
        this.autoRotate = true;
        this.showParticles = true;
        this.hoveredCity = null;
        this.selectedCity = null;
        
        this.init();
    }

    async init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createControls();
        this.createLights();
        this.createChinaMap();
        this.createCityMarkers();
        this.createStars();
        
        // 获取天气数据
        await this.fetchWeatherData();
        
        // 创建天气粒子效果
        this.createWeatherParticles();
        
        // 设置事件监听
        this.setupEventListeners();
        
        // 隐藏加载界面
        document.getElementById('loading').classList.add('hidden');
        
        // 开始动画循环
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.02);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 6);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }

    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;
        this.controls.autoRotate = this.autoRotate;
        this.controls.autoRotateSpeed = 0.5;
    }

    createLights() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        // 主光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // 蓝色补光
        const blueLight = new THREE.PointLight(0x00d4ff, 1, 20);
        blueLight.position.set(-5, 2, 5);
        this.scene.add(blueLight);

        // 紫色补光
        const purpleLight = new THREE.PointLight(0x7b2ff7, 0.8, 20);
        purpleLight.position.set(5, -2, 5);
        this.scene.add(purpleLight);
    }

    createChinaMap() {
        // 中国大陆 - 雄鸡形状轮廓（包含主要地理特征）
        const mainlandOutline = [
            // 东北（鸡头）- 从黑龙江开始
            [1.2, 1.35],      // 黑龙江最北
            [1.15, 1.25],
            [1.1, 1.15],      // 鸡冠位置
            [1.05, 1.0],
            [1.0, 0.85],      // 吉林附近
            [0.95, 0.75],
            // 东部沿海（鸡胸）
            [0.9, 0.6],       // 辽宁南部
            [0.85, 0.5],      // 渤海湾
            [0.8, 0.45],      // 山东半岛
            [0.75, 0.35],
            [0.78, 0.25],     // 江苏沿海
            [0.8, 0.15],
            [0.82, 0.05],     // 上海/浙江
            [0.8, -0.05],
            [0.75, -0.15],    // 福建
            [0.7, -0.25],
            [0.68, -0.35],    // 广东东部/潮汕
            // 南部（鸡腿）- 雷州半岛
            [0.6, -0.55],
            [0.55, -0.65],    // 雷州半岛
            [0.5, -0.7],
            [0.45, -0.68],    // 海南海峡
            [0.4, -0.65],
            [0.35, -0.6],     // 广西沿海
            [0.3, -0.55],
            [0.25, -0.5],     // 北部湾
            // 西南（鸡尾）
            [0.15, -0.45],
            [0.05, -0.4],     // 云南南部
            [-0.05, -0.35],
            [-0.15, -0.3],    // 云南
            [-0.25, -0.25],
            [-0.35, -0.2],    // 中缅边境
            // 西部（鸡腹）
            [-0.5, -0.1],
            [-0.65, 0.0],     // 西藏南部
            [-0.75, 0.1],
            [-0.85, 0.2],     // 西藏西部
            [-0.9, 0.35],
            [-0.85, 0.5],     // 新疆西南部
            // 西北
            [-0.75, 0.7],
            [-0.6, 0.85],     // 新疆北部
            [-0.45, 0.95],
            [-0.3, 1.05],     // 内蒙古西部
            // 北部（鸡背）
            [-0.1, 1.15],
            [0.1, 1.25],      // 内蒙古中部
            [0.3, 1.3],
            [0.5, 1.35],      // 内蒙古东部
            [0.8, 1.38],
            [1.0, 1.4]        // 回到起点附近
        ];

        // 台湾岛轮廓
        const taiwanOutline = [
            [0.88, -0.28],
            [0.92, -0.25],
            [0.94, -0.22],
            [0.95, -0.18],
            [0.94, -0.14],
            [0.92, -0.11],
            [0.88, -0.1],
            [0.85, -0.12],
            [0.84, -0.15],
            [0.85, -0.2],
            [0.86, -0.25]
        ];

        // 海南岛轮廓
        const hainanOutline = [
            [0.42, -0.72],
            [0.46, -0.7],
            [0.48, -0.68],
            [0.49, -0.65],
            [0.48, -0.62],
            [0.45, -0.6],
            [0.42, -0.61],
            [0.4, -0.64],
            [0.39, -0.68],
            [0.4, -0.71]
        ];

        // 南海诸岛（简化表示）
        const southSeaIslands = [
            // 西沙群岛区域
            [0.35, -0.85],
            [0.38, -0.83],
            [0.4, -0.85],
            [0.38, -0.87],
            [0.35, -0.86]
        ];

        // 创建中国大陆形状
        const mainlandShape = new THREE.Shape();
        mainlandShape.moveTo(mainlandOutline[0][0], mainlandOutline[0][1]);
        for (let i = 1; i < mainlandOutline.length; i++) {
            mainlandShape.lineTo(mainlandOutline[i][0], mainlandOutline[i][1]);
        }
        mainlandShape.closePath();

        // 添加台湾岛
        const taiwanShape = new THREE.Shape();
        taiwanShape.moveTo(taiwanOutline[0][0], taiwanOutline[0][1]);
        for (let i = 1; i < taiwanOutline.length; i++) {
            taiwanShape.lineTo(taiwanOutline[i][0], taiwanOutline[i][1]);
        }
        taiwanShape.closePath();

        // 添加海南岛
        const hainanShape = new THREE.Shape();
        hainanShape.moveTo(hainanOutline[0][0], hainanOutline[0][1]);
        for (let i = 1; i < hainanOutline.length; i++) {
            hainanShape.lineTo(hainanOutline[i][0], hainanOutline[i][1]);
        }
        hainanShape.closePath();

        // 添加南海诸岛
        const southSeaShape = new THREE.Shape();
        southSeaShape.moveTo(southSeaIslands[0][0], southSeaIslands[0][1]);
        for (let i = 1; i < southSeaIslands.length; i++) {
            southSeaShape.lineTo(southSeaIslands[i][0], southSeaIslands[i][1]);
        }
        southSeaShape.closePath();

        // 创建几何体
        const extrudeSettings = {
            depth: 0.15,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 3
        };

        const mainlandGeometry = new THREE.ExtrudeGeometry(mainlandShape, extrudeSettings);
        const taiwanGeometry = new THREE.ExtrudeGeometry(taiwanShape, extrudeSettings);
        const hainanGeometry = new THREE.ExtrudeGeometry(hainanShape, extrudeSettings);
        const southSeaGeometry = new THREE.ExtrudeGeometry(southSeaShape, {
            ...extrudeSettings,
            depth: 0.08  // 南海诸岛稍矮一些
        });

        // 计算每个几何体的中心并合并
        const geometries = [mainlandGeometry, taiwanGeometry, hainanGeometry, southSeaGeometry];
        
        // 计算整体边界框
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        geometries.forEach(geo => {
            geo.computeBoundingBox();
            minX = Math.min(minX, geo.boundingBox.min.x);
            maxX = Math.max(maxX, geo.boundingBox.max.x);
            minY = Math.min(minY, geo.boundingBox.min.y);
            maxY = Math.max(maxY, geo.boundingBox.max.y);
        });

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // 居中所有几何体
        geometries.forEach(geo => {
            geo.translate(-centerX, -centerY, 0);
        });

        // 创建材质
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a3e,
            metalness: 0.7,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            emissive: 0x0a0a1a,
            emissiveIntensity: 0.5
        });

        // 创建网格
        const mainlandMesh = new THREE.Mesh(mainlandGeometry, material);
        const taiwanMesh = new THREE.Mesh(taiwanGeometry, material);
        const hainanMesh = new THREE.Mesh(hainanGeometry, material);
        const southSeaMesh = new THREE.Mesh(southSeaGeometry, material);

        // 组合所有地图部分
        const mapGroup = new THREE.Group();
        mapGroup.add(mainlandMesh);
        mapGroup.add(taiwanMesh);
        mapGroup.add(hainanMesh);
        mapGroup.add(southSeaMesh);

        // 添加南海九段线（虚线表示）
        const dashLinePoints = [
            // 九段线的大致位置
            new THREE.Vector3(0.35, -0.75, 0.16),
            new THREE.Vector3(0.45, -0.75, 0.16),
            new THREE.Vector3(0.55, -0.75, 0.16),
            new THREE.Vector3(0.65, -0.7, 0.16),
            new THREE.Vector3(0.7, -0.6, 0.16),
            new THREE.Vector3(0.72, -0.5, 0.16),
            new THREE.Vector3(0.7, -0.4, 0.16),
            new THREE.Vector3(0.65, -0.35, 0.16),
            new THREE.Vector3(0.6, -0.3, 0.16)
        ];

        const lineMaterial = new THREE.LineDashedMaterial({
            color: 0x00d4ff,
            linewidth: 1,
            scale: 1,
            dashSize: 0.05,
            gapSize: 0.03,
            transparent: true,
            opacity: 0.6
        });

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(dashLinePoints);
        const dashLines = new THREE.Line(lineGeometry, lineMaterial);
        dashLines.computeLineDistances();
        mapGroup.add(dashLines);

        // 旋转整个地图组
        mapGroup.rotation.x = -Math.PI / 6;
        this.scene.add(mapGroup);

        // 添加边缘发光效果（ mainland 轮廓）
        const edges = new THREE.EdgesGeometry(mainlandGeometry);
        const lineEdgeMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.5
        });
        const wireframe = new THREE.LineSegments(edges, lineEdgeMaterial);
        
        // 台湾岛轮廓
        const taiwanEdges = new THREE.EdgesGeometry(taiwanGeometry);
        const taiwanWireframe = new THREE.LineSegments(taiwanEdges, lineEdgeMaterial);
        
        // 海南岛轮廓
        const hainanEdges = new THREE.EdgesGeometry(hainanGeometry);
        const hainanWireframe = new THREE.LineSegments(hainanEdges, lineEdgeMaterial);

        const edgeGroup = new THREE.Group();
        edgeGroup.add(wireframe);
        edgeGroup.add(taiwanWireframe);
        edgeGroup.add(hainanWireframe);
        edgeGroup.rotation.x = -Math.PI / 6;
        this.scene.add(edgeGroup);

        // 保存引用
        this.mapMesh = mapGroup;
        this.mapWireframe = edgeGroup;

        // 调整城市坐标以匹配新的中心
        CITIES.forEach(city => {
            city.x -= centerX;
            city.y -= centerY;
        });
    }
    }

    createCityMarkers() {
        CITIES.forEach(city => {
            // 创建城市标记组
            const group = new THREE.Group();
            
            // 主标记球体
            const geometry = new THREE.SphereGeometry(0.04, 16, 16);
            const material = new THREE.MeshPhysicalMaterial({
                color: 0x00d4ff,
                metalness: 0.5,
                roughness: 0.2,
                emissive: 0x00d4ff,
                emissiveIntensity: 0.5
            });
            const sphere = new THREE.Mesh(geometry, material);
            
            // 外圈光环
            const ringGeometry = new THREE.RingGeometry(0.06, 0.08, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x00d4ff,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = -Math.PI / 2;
            
            // 脉冲动画环
            const pulseGeometry = new THREE.RingGeometry(0.08, 0.1, 32);
            const pulseMaterial = new THREE.MeshBasicMaterial({
                color: 0x00d4ff,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide
            });
            const pulseRing = new THREE.Mesh(pulseGeometry, pulseMaterial);
            pulseRing.rotation.x = -Math.PI / 2;
            
            group.add(sphere);
            group.add(ring);
            group.add(pulseRing);
            
            // 设置位置（匹配地图旋转角度）
            const rotatedPos = this.rotatePoint(city.x, city.y, -Math.PI / 6);
            group.position.set(rotatedPos.x, rotatedPos.y, rotatedPos.z + 0.1);
            
            // 保存城市数据到 mesh
            sphere.userData = { city, type: 'city', group };
            ring.userData = { city, type: 'city', group };
            pulseRing.userData = { city, type: 'city', group };
            
            this.cityMeshes.push(sphere, ring, pulseRing);
            this.scene.add(group);
            
            // 保存引用
            city.mesh = group;
            city.sphere = sphere;
            city.pulseRing = pulseRing;
        });
    }

    rotatePoint(x, y, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: x,
            y: y * cos - 0 * sin,
            z: y * sin + 0 * cos
        };
    }

    createStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 2000;
        const positions = new Float32Array(starsCount * 3);
        const colors = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;

            // 星星颜色变化
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.2 + 0.5, 0.5, 0.8);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.stars);
    }

    async fetchWeatherData() {
        // 使用模拟数据（实际项目中可以调用真实 API）
        // Open-Meteo API 示例：https://api.open-meteo.com/v1/forecast
        
        for (const city of CITIES) {
            try {
                // 模拟 API 调用延迟
                await new Promise(resolve => setTimeout(resolve, 50));
                
                // 模拟天气数据（实际使用时替换为真实 API）
                const mockWeather = this.generateMockWeather(city);
                this.weatherData[city.name] = mockWeather;
                
                // 更新城市标记颜色
                this.updateCityMarker(city, mockWeather);
            } catch (error) {
                console.error(`Failed to fetch weather for ${city.name}:`, error);
            }
        }
    }

    generateMockWeather(city) {
        // 根据城市位置生成合理的模拟天气
        const isNorth = city.lat > 35;
        const isSouth = city.lat < 25;
        const isCoastal = ['上海', '青岛', '大连', '厦门', '深圳', '广州', '天津'].includes(city.name);
        
        let code;
        const rand = Math.random();
        
        if (isNorth && Math.random() > 0.7) {
            // 北方冬季可能有雪
            code = rand > 0.5 ? 71 : (rand > 0.3 ? 73 : 0);
        } else if (isCoastal && Math.random() > 0.6) {
            // 沿海城市多雨
            code = rand > 0.5 ? 51 : (rand > 0.3 ? 61 : 80);
        } else if (isSouth && Math.random() > 0.5) {
            // 南方多云或雨
            code = rand > 0.6 ? 2 : (rand > 0.3 ? 51 : 3);
        } else {
            // 默认晴朗或多云
            code = rand > 0.4 ? 0 : (rand > 0.2 ? 1 : 2);
        }
        
        // 温度根据纬度调整
        let baseTemp = 25 - Math.abs(city.lat - 25) * 0.5;
        if (isNorth) baseTemp -= 5;
        if (isSouth) baseTemp += 3;
        
        const temp = Math.round(baseTemp + (Math.random() - 0.5) * 10);
        
        return {
            code,
            temp,
            humidity: Math.round(40 + Math.random() * 50),
            windSpeed: Math.round(Math.random() * 30),
            visibility: Math.round(5 + Math.random() * 15),
            forecast: Array.from({ length: 5 }, (_, i) => ({
                day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][(new Date().getDay() + i) % 7],
                code: Math.floor(Math.random() * 4),
                tempMax: temp + Math.round((Math.random() - 0.3) * 5),
                tempMin: temp - Math.round(5 + Math.random() * 5)
            }))
        };
    }

    updateCityMarker(city, weather) {
        const weatherInfo = WEATHER_CODES[weather.code] || WEATHER_CODES[0];
        const color = new THREE.Color(weatherInfo.color);
        
        if (city.sphere) {
            city.sphere.material.color = color;
            city.sphere.material.emissive = color;
        }
    }

    createWeatherParticles() {
        // 为每个城市创建天气粒子效果
        CITIES.forEach(city => {
            const weather = this.weatherData[city.name];
            if (!weather) return;
            
            const weatherInfo = WEATHER_CODES[weather.code] || WEATHER_CODES[0];
            
            if (weatherInfo.type === 'rainy') {
                this.createRainParticles(city);
            } else if (weatherInfo.type === 'snowy') {
                this.createSnowParticles(city);
            } else if (weatherInfo.type === 'sunny') {
                this.createSunParticles(city);
            } else {
                this.createCloudParticles(city);
            }
        });
    }

    createRainParticles(city) {
        const count = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = city.x + (Math.random() - 0.5) * 0.3;
            positions[i3 + 1] = city.y + 0.3 + Math.random() * 0.5;
            positions[i3 + 2] = city.z + (Math.random() - 0.5) * 0.3;
            velocities[i] = 0.02 + Math.random() * 0.03;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x00d4ff,
            size: 0.015,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = { type: 'rain', velocities, city };
        
        this.particleSystems[city.name] = particles;
        this.scene.add(particles);
    }

    createSnowParticles(city) {
        const count = 80;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = city.x + (Math.random() - 0.5) * 0.3;
            positions[i3 + 1] = city.y + 0.3 + Math.random() * 0.5;
            positions[i3 + 2] = city.z + (Math.random() - 0.5) * 0.3;
            velocities[i3] = (Math.random() - 0.5) * 0.01;
            velocities[i3 + 1] = -(0.005 + Math.random() * 0.01);
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.02,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = { type: 'snow', velocities, city };
        
        this.particleSystems[city.name] = particles;
        this.scene.add(particles);
    }

    createSunParticles(city) {
        const count = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const angle = (i / count) * Math.PI * 2;
            const radius = 0.1 + Math.random() * 0.1;
            positions[i3] = city.x + Math.cos(angle) * radius;
            positions[i3 + 1] = city.y + 0.2 + Math.sin(angle) * radius * 0.3;
            positions[i3 + 2] = city.z + Math.sin(angle) * radius;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xffd700,
            size: 0.025,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = { type: 'sun', city, time: 0 };
        
        this.particleSystems[city.name] = particles;
        this.scene.add(particles);
    }

    createCloudParticles(city) {
        const count = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = city.x + (Math.random() - 0.5) * 0.4;
            positions[i3 + 1] = city.y + 0.3 + Math.random() * 0.2;
            positions[i3 + 2] = city.z + (Math.random() - 0.5) * 0.4;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xa0a0a0,
            size: 0.03,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = { type: 'cloud', city, time: 0 };
        
        this.particleSystems[city.name] = particles;
        this.scene.add(particles);
    }

    updateParticles() {
        if (!this.showParticles) return;
        
        Object.values(this.particleSystems).forEach(system => {
            const positions = system.geometry.attributes.position.array;
            const data = system.userData;
            
            if (data.type === 'rain') {
                for (let i = 0; i < data.velocities.length; i++) {
                    const i3 = i * 3;
                    positions[i3 + 1] -= data.velocities[i];
                    
                    // 重置雨滴位置
                    if (positions[i3 + 1] < data.city.y - 0.2) {
                        positions[i3 + 1] = data.city.y + 0.5;
                        positions[i3] = data.city.x + (Math.random() - 0.5) * 0.3;
                        positions[i3 + 2] = data.city.z + (Math.random() - 0.5) * 0.3;
                    }
                }
            } else if (data.type === 'snow') {
                for (let i = 0; i < data.velocities.length / 3; i++) {
                    const i3 = i * 3;
                    positions[i3] += data.velocities[i3];
                    positions[i3 + 1] += data.velocities[i3 + 1];
                    positions[i3 + 2] += data.velocities[i3 + 2];
                    
                    // 重置雪花位置
                    if (positions[i3 + 1] < data.city.y - 0.2) {
                        positions[i3 + 1] = data.city.y + 0.5;
                        positions[i3] = data.city.x + (Math.random() - 0.5) * 0.3;
                        positions[i3 + 2] = data.city.z + (Math.random() - 0.5) * 0.3;
                    }
                }
            } else if (data.type === 'sun') {
                data.time += 0.02;
                for (let i = 0; i < positions.length / 3; i++) {
                    const i3 = i * 3;
                    const angle = (i / (positions.length / 3)) * Math.PI * 2 + data.time;
                    const radius = 0.1 + Math.sin(data.time * 2 + i) * 0.02;
                    positions[i3] = data.city.x + Math.cos(angle) * radius;
                    positions[i3 + 1] = data.city.y + 0.2 + Math.sin(angle) * radius * 0.3;
                    positions[i3 + 2] = data.city.z + Math.sin(angle) * radius;
                }
            } else if (data.type === 'cloud') {
                data.time += 0.01;
                for (let i = 0; i < positions.length / 3; i++) {
                    const i3 = i * 3;
                    positions[i3] += Math.sin(data.time + i) * 0.001;
                }
            }
            
            system.geometry.attributes.position.needsUpdate = true;
        });
    }

    updateCityAnimations() {
        const time = Date.now() * 0.001;
        
        CITIES.forEach(city => {
            if (city.pulseRing) {
                const scale = 1 + Math.sin(time * 2 + city.x) * 0.2;
                city.pulseRing.scale.set(scale, scale, 1);
                city.pulseRing.material.opacity = 0.3 - Math.sin(time * 2 + city.x) * 0.15;
            }
        });
        
        // 星星闪烁
        if (this.stars) {
            this.stars.rotation.y += 0.0002;
        }
    }

    setupEventListeners() {
        // 鼠标移动
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.checkIntersection(e.clientX, e.clientY);
        });

        // 点击
        window.addEventListener('click', () => {
            if (this.hoveredCity) {
                this.selectCity(this.hoveredCity);
            }
        });

        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 控制按钮
        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetView();
        });

        document.getElementById('toggle-rotate').addEventListener('click', (e) => {
            this.autoRotate = !this.autoRotate;
            this.controls.autoRotate = this.autoRotate;
            e.currentTarget.classList.toggle('active');
        });

        document.getElementById('toggle-particles').addEventListener('click', (e) => {
            this.showParticles = !this.showParticles;
            Object.values(this.particleSystems).forEach(system => {
                system.visible = this.showParticles;
            });
            e.currentTarget.classList.toggle('active');
        });

        document.getElementById('close-panel').addEventListener('click', () => {
            document.getElementById('weather-panel').classList.remove('show');
            this.selectedCity = null;
        });

        // 默认激活自动旋转按钮
        document.getElementById('toggle-rotate').classList.add('active');
        document.getElementById('toggle-particles').classList.add('active');
    }

    checkIntersection(clientX, clientY) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.cityMeshes);

        const tooltip = document.getElementById('tooltip');

        if (intersects.length > 0) {
            const city = intersects[0].object.userData.city;
            if (city && city !== this.hoveredCity) {
                this.hoveredCity = city;
                
                // 高亮效果
                if (city.sphere) {
                    city.sphere.scale.set(1.5, 1.5, 1.5);
                }
                
                // 显示提示
                const weather = this.weatherData[city.name];
                const weatherInfo = weather ? WEATHER_CODES[weather.code] : WEATHER_CODES[0];
                
                tooltip.innerHTML = `
                    <div class="city-name">${city.name}</div>
                    <div class="weather-brief">
                        <span>${weatherInfo.icon}</span>
                        <span>${weather ? weather.temp + '°C' : '--'}</span>
                        <span>${weatherInfo.name}</span>
                    </div>
                `;
                tooltip.classList.add('show');
            }
            
            tooltip.style.left = clientX + 15 + 'px';
            tooltip.style.top = clientY + 15 + 'px';
        } else {
            if (this.hoveredCity) {
                // 取消高亮
                if (this.hoveredCity.sphere) {
                    this.hoveredCity.sphere.scale.set(1, 1, 1);
                }
                this.hoveredCity = null;
                tooltip.classList.remove('show');
            }
        }
    }

    selectCity(city) {
        this.selectedCity = city;
        const weather = this.weatherData[city.name];
        if (!weather) return;

        const weatherInfo = WEATHER_CODES[weather.code];
        
        // 更新面板
        document.getElementById('city-name').textContent = city.name;
        document.getElementById('temp').textContent = `${weather.temp}°C`;
        document.getElementById('condition').textContent = `${weatherInfo.icon} ${weatherInfo.name}`;
        document.getElementById('humidity').textContent = `${weather.humidity}%`;
        document.getElementById('wind').textContent = `${weather.windSpeed} km/h`;
        document.getElementById('visibility').textContent = `${weather.visibility} km`;

        // 更新预报
        const forecastEl = document.getElementById('forecast');
        forecastEl.innerHTML = weather.forecast.map(day => {
            const dayWeather = WEATHER_CODES[day.code] || WEATHER_CODES[0];
            return `
                <div class="forecast-day">
                    <div class="day">${day.day}</div>
                    <div class="icon">${dayWeather.icon}</div>
                    <div class="temp-range">${day.tempMax}° / ${day.tempMin}°</div>
                </div>
            `;
        }).join('');

        // 显示面板
        document.getElementById('weather-panel').classList.add('show');

        // 相机动画聚焦到城市
        this.focusOnCity(city);
    }

    focusOnCity(city) {
        const targetPos = new THREE.Vector3(city.x * 1.5, city.y * 1.5, 4);
        const startPos = this.camera.position.clone();
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            this.camera.position.lerpVectors(startPos, targetPos, eased);
            this.controls.target.set(city.x, city.y, 0);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    resetView() {
        const targetPos = new THREE.Vector3(0, 0, 6);
        const startPos = this.camera.position.clone();
        const duration = 800;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            this.camera.position.lerpVectors(startPos, targetPos, eased);
            this.controls.target.lerp(new THREE.Vector3(0, 0, 0), eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
        
        document.getElementById('weather-panel').classList.remove('show');
        this.selectedCity = null;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.controls.update();
        this.updateParticles();
        this.updateCityAnimations();

        this.renderer.render(this.scene, this.camera);
    }
}

// 启动应用
new WeatherMap();
