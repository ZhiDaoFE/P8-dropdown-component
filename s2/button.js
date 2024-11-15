const Button = ((document) => {
  const defaultCls = 'zd-btn';
  const disabledCls = 'z-disabled';
  const iconCls = 'zd-btn-icon';
  const iconPosEndCls = 'zd-btn--icon-end';
  const ICON_POS = {
    START: 'start',
    END: 'end'
  };
  return class extends BaseComWithDom {
    // _text;
    // _onClick;
    // _disabled;
    // _iconDom;
    // _textDom;
    // _iconPosition;

    constructor(props = {}) {
      super({...props, cls: props.cls ? `${props.cls} ${defaultCls}` : defaultCls});
    }

    _build() {
      this._text = this.getRoot().innerText;
      this.getRoot().innerHTML = `<span class="${iconCls}"></span><span>${this._text}</span>`;
      this._iconDom = this.getRoot().children[0];
      this._textDom = this.getRoot().children[1];
    }

    init(props = {}) {
      this._build(); 

      const { text, onClick, disabled, iconPosition, icon } = props;
           
      this.setText(text || this._text)
        .setIcon(icon)
        .setIconPosition(iconPosition)
        .setDisabled(disabled)
        .setOnClick(onClick);
    }

    setText(text = '') {
      text = String(text);

      if (text !== this._text && this._textDom) {
        this._text = text;
        this._textDom.innerText = this._text;
      }

      return this;
    }

    getText() {
      return this._text;
    }

    setIcon(icon) {
      if (typeof icon === 'string') {
        this._iconDom.innerHTML = icon;
      } else if (icon instanceof HTMLElement) {
        if (this._iconDom.children.length) {
          this._iconDom.replaceChild(icon, this._iconDom.children[0]);
        } else {
          this._iconDom.appendChild(icon);
        }
      }

      return this;
    }

    setDisabled(disabled) {
      this._disabled = !!disabled;

      this[`${this._disabled ? 'add' : 'remove'}ClassName`](disabledCls);

      return this;
    }

    isDisabled() {
      return this._disabled;
    }

    setOnClick(onClick) {
      if (onClick && typeof onClick !== 'function') {
        throw new TypeError('onClick 必须是个函数');
      }

      if (onClick) {
        if (this._onClick) {
          this.getRoot().removeEventListener('click', this._onClick);
        }
        
        this._onClick = onClick;
        this.getRoot().addEventListener('click', this._onClick);
      }

      return this;
    }

    setIconPosition(pos) {
      this._iconPosition = pos;
      
      this[`${this._iconPosition === ICON_POS.END ? 'add' : 'remove'}ClassName`](iconPosEndCls);

      return this;
    }

    getIconPosition() {
      return this._iconPosition;
    }

    resetClassName() {
      super.resetClassName();

      if (this._disabled) {
        this.addClassName(disabledCls);
      }

      if (this._iconPosition === ICON_POS.END) {
        this.addClassName(iconPosEndCls);
      }

      return this;
    }

    destory() {
      if (this._onClick) {
        this.getRoot().removeEventListener('click', this._onClick);
      }

      return this;
    }
  }
})(document);