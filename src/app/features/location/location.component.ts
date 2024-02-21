import { Component ,TemplateRef,ViewChild} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent {

  @ViewChild('motionCaptureDialog') motionCaptureDialog: TemplateRef<any> = {} as TemplateRef<any>;
  @ViewChild('map') map: google.maps.Map | undefined;
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;
  display: google.maps.LatLngLiteral | undefined;
  markerPositions: google.maps.LatLngLiteral[] = [
    { lat: 27.638471699392344, lng: 2.5957031249999973},
    { lat: 27.32658305694333, lng: 16.833984374999996 },
    { lat: 14.980549930938247, lng: 18.328124999999996 }];
  markers : any = new google.maps.Marker({
    draggable : false,
    position:{
      lat: 27.638471699392344, lng: 2.5957031249999973,
    },
    label: {
      color: 'black',
      text: 'Marker label ',
    },
    title: 'Marker title ',
    icon: 'assets/icons/battery.svg'
  });
  markersArr : any[] = [
    {
      id: 1,
      markerPosition : {
        lat: 27.638471699392344, lng: 2.5957031249999973,
      },
      icon: 'assets/icons/battery.svg'
    },
    {
      id:2,
      markerPosition : {
        lat: 27.32658305694333, lng: 16.833984374999996,
      },
      icon: 'assets/icons/camera.svg'
    },
    {
      id:3,
      markerPosition : {
        lat: 14.980549930938247, lng: 18.328124999999996,
      },
      icon: 'assets/icons/door-close.svg'
    }
  ];
  constructor(private webSocketService: SocketService,private dialog: MatDialog) {}
  moveMap(event: google.maps.MapMouseEvent) {
    this.center = (event.latLng!.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng?.toJSON();
  }
  ngOnInit() {
    this.markersArr.push(this.markers)
    this.webSocketService.getClientMessage().subscribe((res: any)=>{
      console.log(res)
    })

    this.webSocketService.getMotionDetectionAlert().subscribe((res: any)=>{
     this.dialog.open(this.motionCaptureDialog, {
        disableClose: true,
        autoFocus: false
      });
    })

    this.webSocketService.getHeatIndicationAlert().subscribe((obj: any)=>{
      let markerIndx = this.markersArr.findIndex(o => o.id == obj.deviceId);
      if(obj.heatPercent < 60){
       this.markersArr[markerIndx].icon = "assets/icons/battery_warning.svg";
      }else {
        this.markersArr[markerIndx].icon = "assets/icons/battery.svg";
      }
    })
    this.webSocketService.getDoorOperationAlert().subscribe((obj: any)=>{
      //let obj = JSON.parse(res);
      let markerIndx = this.markersArr.findIndex(o => o.id == obj.deviceId);
      if(obj.operation =="open"){
       this.markersArr[markerIndx].icon = "assets/icons/door-open.svg";
      }else {
        this.markersArr[markerIndx].icon = "assets/icons/door-close.svg";
      }
    })
  }
}
