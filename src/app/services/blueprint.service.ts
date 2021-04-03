import { Injectable } from '@angular/core';
import { NodeComponent, Poles } from '../components/tabs/blueprint/node/node.component';

@Injectable({
  providedIn: 'root'
})
export class BlueprintService {

  private context: CanvasRenderingContext2D;

  private readonly enableSkeleton = false;

  private drawState: DrawStates = "none";
  private drawingOriginPos: Tuple;

  private ghostSize: Tuple;
  private mousePos: Tuple;
  private scrollIntervalId: number;
  private tresholdMousePole: Poles[];

  private canvas: HTMLCanvasElement;
  private wrapper: HTMLElement;
  private overlay: HTMLElement;

  public ghostNode: Tuple;


  constructor() { }

  public init(canvas: HTMLCanvasElement, wrapper: HTMLElement, overlay: HTMLElement) {

    this.canvas = canvas;
    this.wrapper = wrapper;
    this.overlay = overlay;

    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.wrapper.clientWidth * 2;
    this.canvas.height = this.wrapper.clientHeight * 2;
    this.canvas.style.width = this.canvas.width + "px";
    this.canvas.style.height = this.canvas.height + "px";
    this.overlay.style.width = this.canvas.width + "px";
    this.overlay.style.height = this.canvas.height + "px";
    this.wrapper.addEventListener("scroll", () => this.onScroll());
    this.wrapper.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.wrapper.addEventListener("click", (e) => this.onClick(e));
  }

  /**
   * Scroll event
   */
  private onScroll() {
    if (this.drawState === "drawing") {
      this.drawGhostNodeAndRel(this.mousePos);
    }
  }
  /**
   * Mouse Move event
   */
  private onMouseMove(e: MouseEvent) {
    if (this.drawState === "drawing") {
      this.mousePos = [e.x, e.y];
      const currTreshold = this.tresholdMouse([e.clientX, e.clientY]);
      if (!this.tresholdMousePole?.equals(currTreshold) && this.scrollIntervalId) {
        window.clearInterval(this.scrollIntervalId);
        this.tresholdMousePole = currTreshold;
        this.scrollIntervalId = null;
      }
      if (currTreshold.length > 0 && !this.scrollIntervalId) {
        this.scrollIntervalId = window.setInterval(() => this.adaptViewport(currTreshold), 16.6);   //60fps
        this.tresholdMousePole = currTreshold;
      }

      this.drawGhostNodeAndRel([e.x, e.y]);
    }
  }
  /**
   * On mouse click event
   */
  private onClick(e: MouseEvent) {
    if (this.drawState === "drawing") {
      e.preventDefault();
      this.drawState = "none";
      this.ghostNode = null;
    }
  }

  /**
   * Draw a ghost node on the canvas that follow the mouse
   * Use bezier curve to draw relations
   */
  private drawGhostNodeAndRel(pos: Tuple) {
    let [ox, oy] = this.drawingOriginPos;
    let [ex, ey] = [pos[0], pos[1] - 48];
    ex += this.wrapper.scrollLeft;
    ey += this.wrapper.scrollTop;
    ex = Math.min(ex, this.canvas.width - this.ghostSize[0]);
    ey = Math.min(ey, this.canvas.height - this.ghostSize[1]);
    oy -= 48;
    const [w, h] = [-(ox - ex), oy - ey];
    const [p1x, p1y, p2x, p2y] = [ox + w / 2, oy, ox + w / 2, ey];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = "#b0bec5";
    this.context.beginPath();
    this.context.moveTo(ox, oy);
    this.context.bezierCurveTo(p1x, p1y, p2x, p2y, ex, ey);
    this.context.stroke();
    this.context.closePath();
    this.drawSkeleton([ox, oy], [w, h], [p1x, p1y, p2x, p2y]);

    this.ghostNode = [ex, ey];
  }

  public beginGhostRelation(parent: NodeComponent, e: Tuple) {
    e[0] += this.wrapper.scrollLeft;
    e[1] += this.wrapper.scrollTop;
    this.drawState = "drawing";
    this.ghostSize = [parent.wrapper.nativeElement.clientWidth, parent.wrapper.nativeElement.clientHeight];
    this.drawingOriginPos = e;
    this.ghostNode = e;
  }

  /**
   * AddaptViewport to Mouse (increase viewport and scroll)
   */
  private adaptViewport(treshold: Poles[]) {
    if (treshold.includes("north")) {
      this.wrapper.scrollTop -= 10;
    } if (treshold.includes("south")) {
      if (this.wrapper.isMaxScrollTop)
        this.updateViewPortSize([0, 10]);
      this.wrapper.scrollTop += 10;
    } if (treshold.includes("east")) {
      if (this.wrapper.isMaxScrollLeft)
        this.updateViewPortSize([10, 0]);
      this.wrapper.scrollLeft += 10;
    } if (treshold.includes("west"))
      this.wrapper.scrollLeft -= 10;
  }

  /**
   * Detect if the mouse is in a Pole
   */
  private tresholdMouse(pos: Tuple): Poles[] {
    const treshold = 48;
    const poles: Poles[] = [];
    if (pos[1] - 48 < treshold)
      poles.push("north");
    if (pos[1] > window.innerHeight - treshold)
      poles.push("south");
    if (pos[0] > this.wrapper.clientWidth - treshold)
      poles.push("east");
    if (pos[0] < treshold)
      poles.push("west");
    return poles;
  }
  /**
   * Update the size of the viewport
   */
  private updateViewPortSize(size: Tuple) {
    this.canvas.width += size[0];
    this.canvas.height += size[1];
    this.canvas.style.width = this.canvas.width + "px";
    this.canvas.style.height = this.canvas.height + "px";
    this.overlay.style.width = this.canvas.width + "px";
    this.overlay.style.height = this.canvas.height + "px";
  }

  /**
   * Draw the skeleton if the option is enabled
   */
  private drawSkeleton(o: Tuple, s: Tuple, p: [number, number, number, number]) {
    if (!this.enableSkeleton)
      return;
    this.context.beginPath();
    this.context.arc(p[0], p[1], 5, 0, 2 * Math.PI);  // Control point one
    this.context.fillStyle = "red";
    this.context.fill();
    this.context.closePath();

    this.context.beginPath();
    this.context.arc(p[2], p[3], 5, 0, 2 * Math.PI);  // Control point two
    this.context.fillStyle = "blue";
    this.context.fill();
    this.context.closePath();

    this.context.beginPath();
    this.context.strokeStyle = "yellow";
    this.context.moveTo(o[0], o[1]);
    this.context.lineTo(o[0] + s[0] / 2, o[1]);
    this.context.moveTo(o[0] + s[0] / 2, o[1]);
    this.context.lineTo(o[0] + s[0] / 2, o[1] - s[1]);
    this.context.moveTo(o[0] + s[0] / 2, o[1] - s[1]);
    this.context.lineTo(o[0] + s[0], o[1] - s[1]);
    this.context.stroke();
    this.context.closePath();
  }
}

type DrawStates = "drawing" | "none";
type Tuple = [number, number];