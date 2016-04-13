/**
 * Message preprocessor that parses select markdown notations.
 */
(function () {
    'use strict';

    hl.markdown = function (text) {

        if (!text.trim()) {
            return text;
        }

        // Safe reference.
        var self = function (obj) {
            if (obj instanceof self) {
                return obj;
            }
            if (!(this instanceof self)) {
                return new self(obj);
            }
        };

        // *text* to make bold.
        self.bold = self.bold || /\*([\s\S]+?)\*(?!\*)/gm;
        text = text.replace(self.bold, '<strong>$1</strong>');

        // _text_ to italicize.
        self.it = self.it || /_([\s\S]+?)_(?!_)/gm;
        text = text.replace(self.it, '<em>$1</em>');

        // ~text~ to strike through.
        self.strike = self.strike || /~([\s\S]+?)~(?!~)/gm;
        text = text.replace(self.strike, '<strike>$1</strike>');

        // `text` to preformat.
        self.code = self.code || /`([\s\S]+?)`(?!`)/gm;
        text = text.replace(self.code, '<pre>$1</pre>');

        // >text to quote.
        self.quote = self.quote || /^&gt;(.+)$/gm;
        text = text.replace(self.quote, '<blockquote>$1</blockquote>');

        return text;
    };

})();