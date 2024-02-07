import * as THREE from 'three';
import { IEntity } from './Common';
import { Rectangle } from './entities/Rectangle';
import { Input } from './Input';
import { CameraController } from './CameraController';

document.addEventListener('DOMContentLoaded', () => {
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xFFFFFF);
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

const entitiList: IEntity[] = [];
const input = new Input(entitiList, scene, camera);
input.init();

entitiList.push(new Rectangle(scene));
entitiList.push(new CameraController());

function animate() {
	requestAnimationFrame( animate );

	entitiList.forEach((entity) => {
		entity.update(input, camera, renderer, entitiList);
		entity.render(input, camera, renderer);
	});

	renderer.render( scene, camera );
}

animate();

// on window resize, adjust the camera aspect ratio and renderer size
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

});