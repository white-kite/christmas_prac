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
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.set(1050, 500, 500);
    scene.add(camera);

    // Light
    const directionalLight = new THREE.DirectionalLight("white", 15);
    directionalLight.position.x = 50;
    directionalLight.position.z = 10;
    scene.add(directionalLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 15);
    light1.position.set(100, 20, 10);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 10);
    light2.position.set(300, 200, 100);
    scene.add(light2);

    const light3 = new THREE.DirectionalLight(0xffffff, 0.8);
    light3.position.set(-20, 10, 0);
    scene.add(light3);


    // Controls (카메라 시점 조절)
    const controls = new OrbitControls(camera, renderer.domElement);


    // 로딩 화면 숨김 및 GLB 파일 로드
    function hideLoadingScreen() {
        loadingScreen.style.display = 'none'; // 로딩화면 숨김처리
        canvas.style.display = 'block';
 
    } 

    // GLB 모델 로드
    const gltfLoader = new GLTFLoader();
        
    gltfLoader.load("./models/room.glb", function(gltf) {
        const room = gltf.scene;
        room.position.set(0, 0, 0);
        room.scale.set(300, 300, 300);
        console.log('room.scale 지정됨');
        scene.add(room);
        draw(); // 모델이 준비된 후 렌더링 루프 시작
    }, undefined, function(error) {
        console.error('GLB 파일 로딩 에러:', error);
    });

    // 그리기
    function draw() {
        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
    }

    // 화면 크기 조정 이벤트
    window.addEventListener("resize", function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    // 초기 로딩 화면 설정
    canvas.style.display = 'none';
    loadingScreen.style.display = 'block';
    setTimeout(hideLoadingScreen, 3000); // 3초 후 로딩 화면 숨김

    // 로딩 화면 표시 및 로딩 프로세스 시작
    /*canvas.style.display = 'none';
    loadingScreen.style.display = 'block';
    setTimeout(() => {
        // 지연 후 로딩 화면 보장,
        // GLB 로딩이 매우 빠르게 완료되더라도
    }, 3000);*/

   
}

