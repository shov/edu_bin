import * as THREE from 'three';
import { IEntity } from './Common';
import { Rectangle } from './entities/Rectangle';
import { Input } from './Input';
import { CameraController } from './CameraController';
import { RenderUnlockedStack } from './RenderUnlockedStack';
import { Curve } from './entities/Curve';

document.addEventListener('DOMContentLoaded', () => {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xFFFFFF);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);

	camera.position.z = 5;

	const entitiList: IEntity[] = [];
	const input = new Input(entitiList, scene, camera);
	

	const renderUnlockedStack = new RenderUnlockedStack(
		scene, renderer, camera, entitiList, input
	)
	input.init(renderUnlockedStack);


	entitiList.push(Rectangle.createDefault(scene, input, entitiList, 0, 0));
	entitiList.push(new CameraController());

	renderUnlockedStack.start();

	// on window resize, adjust the camera aspect ratio and renderer size
	window.addEventListener('resize', () => {
		// Update renderer size and pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;

    // Calculate FOV based on the original FOV and window height
    const originalFOV = 75; // Adjust this value as needed
    const windowHeight = window.innerHeight;
    const originalWindowHeight = 600; // Use the initial window height here
    const scaleFactor = windowHeight / originalWindowHeight;
    camera.fov = originalFOV * scaleFactor;

    // Update camera projection matrix
    camera.updateProjectionMatrix();
	});

});