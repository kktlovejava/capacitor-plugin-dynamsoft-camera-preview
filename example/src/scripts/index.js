import '../styles/index.scss';
import { CameraPreview } from "capacitor-plugin-camera-preview";

console.log('webpack starterkit');

//let closeButton = document.getElementById("closeButton");
//let zoominButton = document.getElementById("zoominButton");
//let zoomoutButton = document.getElementById("zoomoutButton");
let startBtn =  document.getElementById("startBtn");
startBtn.addEventListener("click",startCamera);

initialize();

async function initialize(){
  await CameraPreview.initialize();
  await CameraPreview.removeAllListeners();
  await CameraPreview.addListener('onPlayed', async (res) => {
    console.log(res);
    updateResolutionSelect(res.resolution);
  });
  startBtn.disabled = "";
  loadCameras();
  loadResolutions();
  await CameraPreview.setScanRegion({region:{left:10,top:20,right:90,bottom:65,measuredByPercentage:1}});
}

async function startCamera(){
  await CameraPreview.startCamera();
  startBtn.style.display = "none";
  document.getElementsByClassName("controls")[0].style.display = "";
}

async function loadCameras(){
  let cameraSelect = document.getElementById("cameraSelect");
  let result = await CameraPreview.getAllCameras();
  let cameras = result.cameras;
  for (let i = 0; i < cameras.length; i++) {
    cameraSelect.appendChild(new Option(cameras[i], i));
  }
  cameraSelect.addEventListener("change", async function() {
    console.log("camera changed");
    let camSelect = document.getElementById("cameraSelect");
    await CameraPreview.selectCamera({cameraID:camSelect.selectedOptions[0].label});
  });
}

function loadResolutions(){
  let resSelect = document.getElementById("resolutionSelect");
  resSelect.appendChild(new Option("ask 480P", 1));
  resSelect.appendChild(new Option("ask 720P", 2));
  resSelect.appendChild(new Option("ask 1080P", 3));
  resSelect.appendChild(new Option("ask 2K", 4));
  resSelect.appendChild(new Option("ask 4K", 5));
  resSelect.addEventListener("change", async function() {
    let resSelect = document.getElementById("resolutionSelect");
    let lbl = resSelect.selectedOptions[0].label;
    if (lbl.indexOf("ask") != -1) {
      let res = parseInt(resSelect.selectedOptions[0].value);
      await CameraPreview.setResolution({resolution:res});
    }
  });
}

async function updateResolutionSelect(newRes){
  let resSelect = document.getElementById("resolutionSelect");
  for (let index = resSelect.options.length - 1; index >=0 ; index--) {
    let option = resSelect.options[index];
    if (option.label.indexOf("got") != -1) {
      resSelect.removeChild(option);
    }
  }
  resSelect.appendChild(new Option("got "+newRes,"got "+newRes));
  resSelect.selectedIndex = resSelect.length - 1;
}
