import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import dat from "dat.gui";
import gsap from "gsap";


export default function example() {
    
    const canvas = document.querySelector("#three-canvas");
    const loadingScreen = document.getElementById('loading-screen');

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // Scene
    const scene = new THREE.Scene();


    // Camera
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    // 빨간색이 x축, 초록색이 y축, 파란색이 z축
    camera.position.set(750, 480, 1250);
    scene.add(camera);

    // Light
    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.x = 50;
    directionalLight.position.z = 10;
    scene.add(directionalLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 3);
    light1.position.set(300, 200, 400);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.8);
    light2.position.set(-500, 200, -500);
    scene.add(light2);

    // const light3 = new THREE.DirectionalLight(0xffffff, 0.8);
    // light3.position.set(-20, 10, 0);
    // scene.add(light3);


    // Controls (카메라 시점 조절)
    const controls = new OrbitControls(camera, renderer.domElement);


    // 로딩 화면 숨김 및 GLB 파일 로드
    function hideLoadingScreen() {
        loadingScreen.style.display = 'none'; // 로딩화면 숨김처리
        canvas.style.display = 'block';
 
    }

    // 가이드라인
    const helper = new THREE.AxesHelper(3000); // 숫자는 사이즈, 없어도 되긴함
    scene.add(helper);

    // GLB 모델 로드
    const gltfLoader = new GLTFLoader();
        
    gltfLoader.load("./models/room.glb", function(gltf) {
        const room = gltf.scene;
        room.position.set(1000, 0, 700);
        room.scale.set(300, 300, 300);
        // 빨간색이 x축, 초록색이 y축, 파란색이 z축
        room.rotation.set(0,600,0);
        console.log('room.scale 지정됨');
        scene.add(room);
        draw(); // 모델이 준비된 후 렌더링 루프 시작
    }, undefined, function(error) {
        console.error('GLB 파일 로딩 에러:', error);
    });

    // 별빛을 표현할 재질 생성
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // 별빛 색상
        size: 2, // 별빛 크기
        //sizeAttenuation: true // 카메라에서 멀어질수록 별이 작아지도록 설정
    });

    // 별빛 점들 생성
    const starGeometry = new THREE.BufferGeometry();

    const stars = new THREE.Points(starGeometry, starMaterial);
    // 버퍼 속성 생성
    const positions = new Float32Array(1000 * 3); // 1000개의 점 * 3차원 좌표 (x, y, z)
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 별빛을 생성하고 버퍼 속성에 추가하는 반복문
    for (let i = 0; i < 1000; i++) {
        const star = new THREE.Vector3(
            Math.random() * 3000 - 1000, // x 좌표
            Math.random() * 3000 - 1000, // y 좌표
            Math.random() * 3000 - 1000  // z 좌표
        );
        positions[i * 3] = star.x;
        positions[i * 3 + 1] = star.y;
        positions[i * 3 + 2] = star.z;
    }

    // 씬에 별빛 객체 추가
    scene.add(stars);

    // 그리기
    function draw() {
        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);

        // 별빛 회전 효과 추가
        stars.rotation.x += 0.001;
        stars.rotation.y += 0.001;
    }

    // 화면 크기 조정 이벤트
    window.addEventListener("resize", function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    });


    // 초기 로딩 화면 설정
    canvas.style.display = 'none';
    loadingScreen.style.display = 'block';
    setTimeout(hideLoadingScreen, 3000); // 3초 후 로딩 화면 숨김
   
}

