function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var width, height, stage, layer
boxlist = [];
window.onload = function () {
    width = window.innerWidth * 0.8;
    height = window.innerHeight;

    stage = new Konva.Stage({
        container: 'platform',
        width: width,
        height: height,
    });

    layer = new Konva.Layer();

    stage.add(layer);

    var rectX = stage.width();
    var rectY = stage.height();
    floor = new Konva.Rect({
        x: 0,
        y: rectY - 50,
        width: rectX,
        height: 50,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 4,
        draggable: false,
    });

    layer.add(floor);

    stage.add(layer);
}

window.onresize = function () {
    width = window.innerWidth * 0.8;
    height = window.innerHeight;
    stage.width(width);
    stage.height(height);
    floor.width(width)
    floor.y(height-50)
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
    box.on('dragend', function () {

        //tutaj powinno być sprawdzanie kolizji, ale nie wiem sam jak je zrobic
    })

    layer.add(box);
    boxlist.push(box);
    console.log(boxlist)
    console.log(boxlist[0])

    stage.add(layer);
}

