// See https://www.greensock.com/draggable/ for more details.

const droppables = document.querySelectorAll(".box");
const dropArea = document.getElementById("dropArea");
const overlapThreshold = "99%";

// Utility to add/remove class
function addClass(el, className) {
  el.classList.add(className);
}

function removeClass(el, className) {
  el.classList.remove(className);
}

function hasClass(el, className) {
  return el.classList.contains(className);
}

Draggable.create(droppables, {
  bounds: window,
  onDrag: function () {
    if (this.hitTest(dropArea, overlapThreshold)) {
      addClass(this.target, "highlight");
    } else {
      removeClass(this.target, "highlight");
    }
  },
  onDragEnd: function () {
    if (!hasClass(this.target, "highlight")) {
      gsap.to(this.target, {
        duration: 0.2,
        x: 0,
        y: 0,
        width: '200px'
      });
    } else {
      gsap.to(this.target, {
        duration: 0.2,
        width: '300px'
      });
  }
}
    
});
