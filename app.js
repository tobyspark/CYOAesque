/*eslint-env browser*/ // Lets you use document and other standard browser functions
/*eslint no-console: 0*/ // Lets you use console (for example to log something)
/* global PIXI TWEEN */

import { settings } from './settings.js';
import { content } from './content.js';

import { Wipe } from './elements/wipe.js';
import { CircleFill } from './elements/shapes.js';
import { HorizTextBox, VertTextBox } from './elements/textbox.js';

// TASK: Initialise

// Align to pixel-grid
// +ve crisp boxes, text
// -ve animation moves no longer anti-alias
PIXI.settings.ROUND_PIXELS = true;

const app = new PIXI.Application({
    width: settings.width,
    height: settings.height,
    backgroundColor: 0xFFFFFF,
    antialias: true,
    powerPreference: 'high-performance',
});
document.body.appendChild(app.view);

// Hide cursor over output
if (settings.hideCursor) {
    document.body.setAttribute('style', 'cursor: none;');
}

// Load images declared in content (plus any .add'd here)
contentImageValues()
    //.add( 'assets/some-image-hardcoded-in-a-template' )
    .forEach( image => app.loader.add(image) );

// Register custom TWEEN plugins
registerTypeon();

// TASK: Configure run-loop

// Important! Set this to execute the next node
let nextNode = null;
// Book-keeping for node history. Index 0 is current.
const nodeHistory = [];
// Book-keeping for reset timer
let timeoutID = null;
app.ticker.add( () => {
    TWEEN.update(app.ticker.deltaMS);
    
    if (nextNode) {
        // Update node history
        nodeHistory.unshift(nextNode);
        while (nodeHistory.length > 10) {
            nodeHistory.pop();
        }
        
        // Find and execute next node
        if (nextNode in content.nodes) {
            const node = content.nodes[nextNode];
            node.name = nextNode;
            template[node.template](node);
        } else if (nextNode in template) {
            template[nextNode]();
        } else {
            throw `Unknown nextNode ${nextNode}`;
        }
        nextNode = null;
        
        // Re-arm timeout
        if (timeoutID) { window.clearTimeout(timeoutID); }
        timeoutID = window.setTimeout(reset, settings.timeoutSecs*1000);
    }
});

// TASK: GO!

// Set the opening node to be picked up by the run loop when the loader has finished loading
app.loader.load( () => nextNode = content.entryNode );

// RESOURCES: Templated content-node factory

// Book-keeping for tweens used in each node
// Book-keeping for stage objects used in each node is via nodesOnStage()
const nodeTweens = {}; 
// Template functions to execute each new node.
const template = {
    intro: () => {
        const group = new PIXI.Container();
        group.name = 'intro';
        app.stage.addChild(group);
        
        const tweens = {};
        nodeTweens.intro = tweens;
        
        const titleSize = settings.height/3;
        
        const logo = new PIXI.Sprite.from(
            'assets/spark-logo.svg',
            {resourceOptions: {width: titleSize}},
        );
        logo.anchor.set(0.5, 0.5);
        logo.tint = 0x000000;
        
        const logoGraphic = new PIXI.Container();
        logoGraphic.addChild(new CircleFill(0, 0, titleSize));
        logoGraphic.addChild(logo);
        logoGraphic.x = settings.width/2;
        logoGraphic.y = settings.height/2;
        
        const textStyle = {
            ...settings.styleTitle,
            align: 'center',
            fill: 0xFFFFFF,
        };
        const titleText = new PIXI.Text('Choose\nyour own\nadventure\nesque', textStyle);
        titleText.anchor.set(0.5,0.5);
        titleText.angle = -30;
        
        const titleGraphic = new PIXI.Container();
        titleGraphic.addChild(new CircleFill(0, 0, titleSize, 0x000000));
        titleGraphic.addChild(titleText);
        titleGraphic.x = settings.width/2;
        titleGraphic.y = settings.height/2;
        titleGraphic.mask = new CircleFill(titleGraphic.x, titleGraphic.y, 0);
        
        const wipe = new Wipe(0,0, app.screen.width, app.screen.height);
        
        tweens.wipe = new TWEEN.Tween(wipe)
            .to({transitionPos:1})
            .easing(TWEEN.Easing.Quadratic.InOut);
        
        wipe.onOutCallback = () => {
            app.renderer.backgroundColor = 0xBBBBBB;
            clearNodesFrom(1);
            group.addChildAt(logoGraphic, 0);
        };
        wipe.onOffCallback = () => {
            group.addChild(titleGraphic);
            tweens.titleIn.start();
        };
        
        tweens.titleIn = new TWEEN.Tween(titleGraphic.mask)
                    .to({radius: titleGraphic.width})
                    .delay(500)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .on('complete', () => {
                        group.removeChild(logoGraphic);
                        titleGraphic.mask = null;
                        tweens.titleMove.start();
                        nextNode = 'mainMenu';
                    });
        
        tweens.titleMove = new TWEEN.Tween(titleGraphic)
                    .to({x: settings.width/3})
                    .easing(TWEEN.Easing.Quadratic.Out);
        
        group.addChild(wipe);
        tweens.wipe.start();
    },
    mainMenu: node => {
        const group = new PIXI.Container();
        group.name = node.name;
        app.stage.addChildAt(group, 0);
        
        const tweens = {};
        nodeTweens[node.name] = tweens;
        
        const choiceCount = node.choices.length;
        const boxHeight = (settings.height - (choiceCount + 1)*settings.margin) / choiceCount;
        const textStyle = { 
            margin: settings.margin,
            textStyle: settings.styleHeadingAlt,
        };
        node.choices.forEach( (choice, i) => {
            const box = new HorizTextBox(
                                settings.margin, 
                                (settings.margin + boxHeight)*i + settings.margin,
                                settings.width - 2*settings.margin, 
                                boxHeight, 
                                choice.text,
                                textStyle,
            );
            box.interactive = true;
            box.on('pointerdown', () => {
                nextNode = choice.to;
            });
            
            group.addChild(box);
            tweens[`choice${i}`] = new TWEEN.Tween(box)
                    .to({transitionPos:1})
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .delay(250*i);
        });
        
        Object.values(tweens).forEach( tween => tween.start() );
    },
    choice: node => {
        const group = new PIXI.Container();
        group.name = node.name;
        app.stage.addChild(group);
        
        const tweens = {};
        nodeTweens[node.name] = tweens;
        
        const mainTextDuration = settings.msPerChar * node.text.length;
        const style = {
            ...settings.styleHeading,
            fill: 0xFFFFFF,
            wordWrap: true,
            wordWrapWidth: settings.width*2/3,
        };
        
        const mainText = new PIXI.Text(node.text, style);
        const mainTextWidth = mainText.width;
        const mainTextHeight = mainText.height;
        mainText.text = '>';
        mainText.anchor.set(0, 0);
        mainText.x = settings.width/2 - mainTextWidth/2;
        mainText.y = settings.height/3 - mainTextHeight/2;
        group.addChild(mainText);
        tweens.typeon = new TWEEN.Tween({typeon:node.text})
            .to({typeon:null}, mainTextDuration)
            .on('update', v => mainText.text = v.typeon);
    
        const choiceCount = node.choices.length;
        const choiceWidth = (settings.width - (choiceCount + 1)*settings.margin) / choiceCount;
        node.choices.forEach( (choice, i) => {
            const image = new PIXI.Sprite.from(app.loader.resources[choice.image].texture);
            const box = new VertTextBox(
                                (settings.margin + choiceWidth)*i + settings.margin, 
                                settings.margin,
                                choiceWidth, 
                                settings.height - 2*settings.margin,
                                choice.text,
                                image,
                                { 
                                    margin: settings.margin,
                                    textStyle: settings.styleBody,
                                },
            );
            box.interactive = true;
            box.on('pointerdown', () => {
                nextNode = choice.to;
            });
            
            group.addChildAt(box, 0);
            tweens[`choice${i}`] = new TWEEN.Tween(box)
                .to({transitionPos:1})
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(250*i);
        });
        
        tweens.previousOut = newPreviousOutTween();
        
        Object.values(tweens).forEach( tween => tween.start() );
    },
};

// SUPPORT UTILITIES

function newPreviousOutTween() {
    return new TWEEN.Tween(app.stage.getChildByName(nodeHistory[1]))
        .to({alpha: 0}, 250)
        .on('complete', () => clearNodesFrom(1) );
}

function clearNodesFrom(from) {
    nodesOnStage({from: from}).forEach( node => {
        Object.values(nodeTweens[node.name]).forEach( tween => TWEEN.remove(tween) );
        node.destroy({children: true, texture: false});
    });
}

function nodesOnStage(options={}) {
    const from = options.from || 0;
    const to = options.to || app.stage.children.length;
    const nodeNames = nodeHistory.slice(from, to);
    return app.stage.children.filter( child => nodeNames.includes(child.name) );
}

function contentImageValues(searchObject = content, found = new Set()) {
    Object.keys(searchObject).forEach( key => {
        if (key === 'image') {
            if (searchObject.image.name) {
                found.add(searchObject.image.name);
            } else {
                found.add(searchObject.image);
            }
            return found;
        }
        if (typeof searchObject[key] === 'object') {
            contentImageValues(searchObject[key], found);
        }
    });
    return found;
}

function registerTypeon() {
    TWEEN.Plugins.typeon = function (node, start, _end) {
    return t => start.substring(0, start.length * t);
    };
}

function reset() {
    TWEEN.removeAll();
    app.stage.children.forEach( child => {
        child.destroy({children: true, texture: false});
    });
    nextNode = content.entryNode;
}