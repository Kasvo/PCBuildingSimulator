import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { gsap } from 'gsap'

const loadingbarElement = document.querySelector('.loading-bar')

//Loaders
const loadingManager = new THREE.LoadingManager(
    //Loaded
    ()=>{

        gsap.delayedCall(0.5,()=>{
            gsap.to(OverlayMaterial.uniforms.uAlpha, {duration : 4 , value : 0})
            loadingbarElement.classList.add('ended')
            loadingbarElement.style.transform = ''
        }) 

    },
    //Progress
    (itemUrl,itemsLoaded,itemsTotal)=>{
        const progressRatio = itemsLoaded/itemsTotal
        loadingbarElement.style.transform = `scaleX(${progressRatio})` //${progressRatio}

        console.log(progressRatio)
            

    }
)
const loader = new GLTFLoader(loadingManager)



const Objects = []
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("#bfd1e5")

//Overlay
const OverLayGeometry = new THREE.PlaneBufferGeometry(2,2,1,1)
const OverlayMaterial = new THREE.ShaderMaterial({
    transparent : true,
    uniforms:{
        uAlpha   : {value:1}
    },
    vertexShader:`
   
    void main()
    {
        gl_Position =  vec4(position , 1.0); 
    }
    `,
    fragmentShader:`
    uniform float uAlpha ;
    void main()
    {
        gl_FragColor = vec4(0.0 ,0.0 ,0.0 ,uAlpha);
    }
    `
})
const Overlay = new THREE.Mesh(OverLayGeometry,OverlayMaterial)
scene.add(Overlay)


/**
 * Object
 */
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height)
camera.position.set(-35, 70, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera)

//model
// Floor
function createFloor() {
    let pos = { x:  Math.PI * 0.5, y: -1, z: 3 };
    let scale = { x: 200, y: 2, z: 100 };
  
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(),
         new THREE.MeshPhongMaterial({ color: '#A47449' }));
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);

    blockPlane.userData.ground = true
    
  }

function motherboard(){
loader.load('/img/mother_board_with_cpu_socket.glb',(motherboard)=>{
    motherboard.scene.scale.set(2,2,2)
    motherboard.scene.position.set(0,1,0)
    motherboard.castShadow = true
    motherboard.receiveShadow = true;
   scene.add(motherboard.scene)
    
})
  }

function CPU(){
    loader.load('/img/cabinat/main_case.glb',(CPU)=>{
        CPU.scene.scale.set(0.8,0.8,0.8)
        CPU.scene.position.set(30,0.1,0)
        CPU.scene.castShadow = true
        CPU.receiveShadow = true;
        scene.add(CPU.scene)
        Objects.push(CPU.scene)
    })
}

function GraphicCard(){
loader.load('/img/graphic_card.glb',(GPU)=>{
    GPU.scene.scale.set(1.5,1.5,1.5)
    GPU.scene.position.set(-30,1,3)
    GPU.scene.castShadow = true
    GPU.scene.receiveShadow = true
   scene.add(GPU.scene)
   Objects.push(GPU.scene)
})
}

function PowerSupply(){
    loader.load('/img/power_supply.glb',(PSU)=>{
        PSU.scene.scale.set(2,2,2)
        PSU.scene.position.set(-30,5,-10)
        
    scene.add(PSU.scene)
        Objects.push(PSU.scene)
    })
}

function createRam(){

    loader.load('/img/ram.glb',(ram)=>{


        ram.draggable = true
        ram.scene.scale.set(0.75,0.75,0.9)
        ram.scene.position.set(20,0,20)

    
        scene.add(ram.scene)
        Objects.push(ram.scene)
        
    })
 
  }

PowerSupply()
GraphicCard()
CPU()
motherboard()
createRam()
createFloor()





//Raycaster
//  const raycaster = new THREE.Raycaster()
//  const clickMouse = new THREE.Vector2()
//  const moveMouse = new THREE.Vector2()

// var draggable = new THREE.Object3D()


//  window.addEventListener('click',event =>{


//     if (draggable != null) {
//         console.log(`dropping draggable ${draggable.userData.name}`)
//         draggable = null 
//         return;
//       }
//     // THREE RAYCASTER
//     clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(clickMouse,camera)
//     const found = raycaster.intersectObjects(scene.children)
//     if(found.length > 0 && found[0].object.userData.draggable){
//         draggable = found[0].object
//         console.log('found draggable' , draggable.userData.name)
//         controls.value = null
//     }

    
//  })

//  window.addEventListener('mousemove', event => {
//     moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   });
  
//   function dragObject() {
//     if (draggable != null) {
//         raycaster.setFromCamera(moveMouse,camera)
//       const found = raycaster.intersectObjects(scene.children);
//       if (found.length > 0) {
//         for (let o of found) {
//           if (!o.object.userData.ground)
//             continue
          

//           draggable.position.x = o.point.x
//           draggable.position.z = o.point.z
//         }
//       }
//     }
//   }


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.20)
scene.add(ambientLight)

let dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(30, 50, -30);
scene.add(dirLight);
let dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight2.position.set(-30, 50, -30);
scene.add(dirLight2);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.bottom = -70;

// const directionallightHelper = new THREE.DirectionalLightHelper(dirLight)
// scene.add(directionallightHelper)
// const directionallightHelper2 = new THREE.DirectionalLightHelper(dirLight2)
// scene.add(directionallightHelper2)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;



//Dragcontrols

// const transformControls = new TransformControls(camera, renderer.domElement);
//     scene.add(transformControls);

const dragcontrols = new DragControls( Objects, camera, renderer.domElement );
const cpuPlacement = new THREE.Mesh(
    new THREE.BoxBufferGeometry(5,5,5),
    new THREE.MeshBasicMaterial({color : '#ff0000',    opacity: 0.7, transparent: 1})
)
cpuPlacement.position.set(1,4.5,-6)


const ramPlacement = new THREE.Mesh(
    new THREE.BoxBufferGeometry(3.5,5,14),
    new THREE.MeshBasicMaterial({color : '#ffffff',    opacity: 0.6, transparent: 1})
)
ramPlacement.position.set(8,5,-6)

const gpuPlacement = new THREE.Mesh(
    new THREE.BoxBufferGeometry(15,8,5),
    new THREE.MeshBasicMaterial({color : '#ff0000',    opacity: 0.7, transparent: 1})
)
gpuPlacement.position.set(-1,6,10)







dragcontrols.addEventListener( 'dragstart', function ( event ) {

	controls.enabled = false


} );
dragcontrols.addEventListener( 'drag', function ( event ) {
    if(event.object.userData.name == "ram.001"){
        event.object.rotation.set(1.5,0,1.55)
        
        
    }
    if(event.object.userData.name == "gc.003"){
        event.object.rotation.set(1.55,0,0)

    }
	controls.enabled = false


} );
dragcontrols.addEventListener( 'dragend', function ( event ) {
    if(event.object.userData.name == "ram.001"){
        event.object.rotation.set(0,0,0)
        
    }
    if(event.object.userData.name == "gc.003"){
        event.object.rotation.set(0,0,0,)

    }
    
	controls.enabled = true

} );

dragcontrols.addEventListener('hoveron',function(event){
    if(event.object.userData.name == "ram.001"){

        scene.add(ramPlacement)
    }
    if(event.object.userData.name == "processor.001"){
        scene.add(cpuPlacement)
    }
    if(event.object.userData.name == "gc.003"){
        scene.add(gpuPlacement)
    }
   
    console.log(event.object.userData.name)
    
    
})
dragcontrols.addEventListener('hoveroff',function(event){
    if(event.object.userData.name == "ram.001"){
        scene.remove(ramPlacement)
    }
    if(event.object.userData.name == "processor.001"){
        scene.remove(cpuPlacement)
    }
    if(event.object.userData.name == "gc.003"){
        scene.remove(gpuPlacement)
    }

    
    
})
console.log(Objects)



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // dragObject()
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()