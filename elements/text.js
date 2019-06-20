/*eslint no-console: 0*/ // Lets you use console (for example to log something)
/* global PIXI */

export class TextExtra extends PIXI.Text {
    lineBounds() {
        // As per private method PIXI.Text.updateText()
        // http://pixijs.download/release/docs/packages_text_src_Text.js.html#line122
        const style = this._style;
        const measured = PIXI.TextMetrics.measureText(this._text || ' ', this._style, this._style.wordWrap, this.canvas);
        const lines = measured.lines;
        const lineHeight = measured.lineHeight;
        const lineWidths = measured.lineWidths;
        const maxLineWidth = measured.maxLineWidth;
        const fontProperties = measured.fontProperties;
                
        let linePositionX;
        let linePositionY;
        
        const lineBounds = [];

        for (let i = 0; i < lines.length; i++)
        {
            linePositionX = style.strokeThickness / 2;
            linePositionY = ((style.strokeThickness / 2) + (i * lineHeight)) + fontProperties.ascent;
            if (style.align === 'right')
            {
                linePositionX += maxLineWidth - lineWidths[i];
            }
            else if (style.align === 'center')
            {
                linePositionX += (maxLineWidth - lineWidths[i]) / 2;
            }
            lineBounds.push(new PIXI.Rectangle(linePositionX, linePositionY, lineWidths[i], lineHeight));
        }
        
        return lineBounds;
    }
}