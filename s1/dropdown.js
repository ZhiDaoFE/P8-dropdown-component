const Dropdown = ((document) => {
  const defaultCls = 'zd-dropdown-trigger';
  const dropdownCls = 'zd-dropdown';
  const menuHiddenCls = 'zd-dropdown--hidden';
  const menuCls = 'zd-dropdown-menu';
  const menuItemCls = 'zd-dropdown-menu-item';
  const menuGap = 4;
  const HIDDEN_DELAY = 100;
  return class extends BaseComWithDom {
    // _menu;
    // _menuDom;
    // _hiddenTimer;

    constructor(props = {}) {
      super({...props, cls: props.cls ? `${props.cls} ${defaultCls}` : defaultCls});
    }

    init(props = {}) {
      this._onMenuClick = this._onMenuClick.bind(this);
      this._openMenu = this._openMenu.bind(this);
      this._closeMenu = this._closeMenu.bind(this);

      this.getRoot().addEventListener('mouseenter', this._openMenu);
      this.getRoot().addEventListener('mouseleave', this._closeMenu);

      const { menu } = props;

      this.setMenu(menu);
    }

    setMenu(menu = []) {
      if (menu instanceof Array && menu.length) {
        this._menu = menu;
        if (this._menuDom) {
          document.body.removeChild(this._menuDom);
        }
        this._buildMenu();
      }

      return this;
    }

    _buildMenu() {
      let cnt = `<ul class="${menuCls}">${
        this._menu
          .map(({ label }, idx) => `<li class="${menuItemCls}" data-idx="${idx}">${label || ''}</li>`)
          .join('')
      }</ul>`;

      this._menuDom = document.createElement('div');
      this._menuDom.classList.add(dropdownCls, menuHiddenCls);
      this._menuDom.innerHTML = cnt;
      
      document.body.appendChild(this._menuDom);
      this._menuDom.addEventListener('click', this._onMenuClick);
      this._menuDom.addEventListener('mouseenter', this._openMenu);
      this._menuDom.addEventListener('mouseleave', this._closeMenu);

      return this;
    }

    _onMenuClick(event) {
      const { target } = event;
      if (target && target.classList?.contains(menuItemCls)) {
        const idx = target.dataset?.idx;
        if (this._menu[idx]?.onClick) {
          this._menu[idx].onClick();
        }
      }
    }

    _getMenuPosition() {
      const rootRect = this.getRoot().getBoundingClientRect();
      const menuRect = this._menuDom.getBoundingClientRect();

      return {
        top: Math.floor(rootRect.bottom + window.pageYOffset + menuGap),
        left: Math.floor(rootRect.left + window.pageXOffset + rootRect.width / 2 - menuRect.width / 2)
      }
    }

    _openMenu() {
      if (this._hiddenTimer) {
        clearTimeout(this._hiddenTimer);
        this._hiddenTimer = null;
        return this;
      }

      if (this._menuDom) {
        const pos = this._getMenuPosition();
        this._menuDom.style.top = `${pos.top}px`;
        this._menuDom.style.left = `${pos.left}px`;
        this._menuDom.classList.remove(menuHiddenCls);
      }

      return this;
    }

    _closeMenu() {
      if (this._menuDom) {
        this._hiddenTimer = setTimeout(() => {
          this._menuDom.classList.add(menuHiddenCls);
          this._hiddenTimer = null;
        }, HIDDEN_DELAY);
      }

      return this;
    }

    getMenu() {
      return this._menu;
    }

    destory() {
      if (this._menuDom) {
        document.body.removeChild(this._menuDom);
      }

      this.getRoot().removeEventListener('mouseenter', this._openMenu);
      this.getRoot().removeEventListener('mouseleave', this._closeMenu);

      return this;
    }
  }
})(document);