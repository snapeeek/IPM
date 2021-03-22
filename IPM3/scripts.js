function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var width, height, stage, layer;
window.onload = function () {
    width = window.innerWidth;
    height = window.innerHeight * 0.8;

    stage = new Konva.Stage({
        container: 'platform',
        width: width,
        height: height,
    });

    layer = new Konva.Layer();

    stage.add(layer);
}

function createBlock() {

    var rectX = stage.width() / 2 - 50;
    var rectY = stage.height() / 2 - 25;
    var color = getRandomColor();
    var box = new Konva.Rect({
        x: rectX,
        y: rectY,
        width: 50,
        height: 50,
        fill: color,
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,
    });
    box.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });
    box.on('mouseout', function () {
        document.body.style.cursor = 'default';
    });

    layer.draw(box);


    stage.refresh()
    console.log("test")
}
