const Dropdown = ((document) => {
  const TRIGGER_TYPE = {
    HOVER: 'hover',
    CLICK: 'click',
    CONTEXTMENU: 'contextMenu'
  };
  const triggerOpsMap = {
    [TRIGGER_TYPE.HOVER]: {
      addRootTrigger: (dd) => {
        dd.getRoot().addEventListener('mouseenter', dd.openMenu);
        dd.getRoot().addEventListener('mouseleave', dd.closeMenu);
      },
      removeRootTrigger: (dd) => {
        dd.getRoot().removeEventListener('mouseenter', dd.openMenu);
        dd.getRoot().removeEventListener('mouseleave', dd.closeMenu);
      },
      addMenuTrigger: (dd) => {
        dd._menuDom && dd._menuDom.addEventListener('mouseenter', dd.openMenu);
        dd._menuDom && dd._menuDom.addEventListener('mouseleave', dd.closeMenu);
      },
      removeMenuTrigger: (dd) => {
        dd._menuDom && dd._menuDom.removeEventListener('mouseenter', dd.openMenu);
        dd._menuDom && dd._menuDom.removeEventListener('mouseleave', dd.closeMenu);
      }
    },
    [TRIGGER_TYPE.CLICK]: {
      addRootTrigger: (dd) => {
        dd.getRoot().addEventListener('click', dd.openMenu);
        document.addEventListener('click', dd.closeMenu);
      },
      removeRootTrigger: (dd) => {
        dd.getRoot().removeEventListener('click', dd.openMenu);
        document.removeEventListener('click', dd.closeMenu);
      },
      addMenuTrigger: () => {},
      removeMenuTrigger: () => {}
    },
    [TRIGGER_TYPE.CONTEXTMENU]: {
      addRootTrigger: (dd) => {
        dd.getRoot().addEventListener('contextmenu', dd.openMenu);
        document.addEventListener('click', dd.closeMenu);
      },
      removeRootTrigger: (dd) => {
        dd.getRoot().removeEventListener('contextmenu', dd.openMenu);
        document.removeEventListener('click', dd.closeMenu);
      },
      addMenuTrigger: () => {},
      removeMenuTrigger: () => {}
    }
  }

  const defaultCls = 'zd-dropdown-trigger';
  const dropdownCls = 'zd-dropdown';
  const menuHiddenCls = 'zd-dropdown--hidden';
  const menuCls = 'zd-dropdown-menu';
  const menuItemCls = 'zd-dropdown-menu-item';
  const menuGap = 4;
  const viewportGap = 8;
  const HIDDEN_DELAY = 100;
  return class extends BaseComWithDom {
    // _menu;
    // _menuDom;
    // _hiddenTimer;
    // _triggerType;
    // _autoAdjustOverflow;
    // _onMenuOpen;
    // _onMenuClose;

    static TRIGGER_TYPE = TRIGGER_TYPE;

    constructor(props = {}) {
      super({...props, cls: props.cls ? `${props.cls} ${defaultCls}` : defaultCls});
    }

    init(props = {}) {
      this._onMenuClick = this._onMenuClick.bind(this);
      this.openMenu = this.openMenu.bind(this);
      this.closeMenu = this.closeMenu.bind(this);

      const { menu, trigger, autoAdjustOverflow, onMenuOpen = () => {}, onMenuClose = () => {} } = props;

      this._autoAdjustOverflow = !!autoAdjustOverflow;
      this._onMenuOpen = onMenuOpen;
      this._onMenuClose = onMenuClose;
      this.setTriggerType(trigger).setMenu(menu);
    }

    setTriggerType(trigger = TRIGGER_TYPE.HOVER) {
      if (!Object.values(TRIGGER_TYPE).includes(trigger)) {
        throw new TypeError(`非法 trigger 参数: ${trigger}`);
      }

      if (this._triggerType !== trigger) {
        if (this._triggerType) {
          triggerOpsMap[this._triggerType].removeRootTrigger(this);
          triggerOpsMap[this._triggerType].removeMenuTrigger(this);
        }
        this._triggerType = trigger;
        triggerOpsMap[this._triggerType].addRootTrigger(this);
        triggerOpsMap[this._triggerType].addMenuTrigger(this);
      }

      return this;
    }

    getTriggerType() {
      return this._triggerType;
    }

    setMenu(menu) {
      this._menu = menu;
      if (this._menuDom) {
        document.body.removeChild(this._menuDom);
      }

      if (menu instanceof Array && menu.length) {
        this._buildMenu();
      } else if (typeof menu === 'function') {
        const menuRet = menu();
        if (menuRet instanceof HTMLElement) {
          this._menuDom = menuRet;
        } else {
          throw new TypeError('menu 函数必须返回一个 Dom 元素');
        }
      } else if (menu instanceof HTMLElement) {
        this._menu = null;
        this._menuDom = menu;
      } else {
        throw new TypeError('非法 menu 参数');
      }

      this._menuDom.classList.add(dropdownCls, menuHiddenCls);
      document.body.appendChild(this._menuDom);
      triggerOpsMap[this._triggerType].addMenuTrigger(this);

      return this;
    }

    _buildMenu() {
      let cnt = `<ul class="${menuCls}">${
        this._menu
          .map(({ label }, idx) => `<li class="${menuItemCls}" data-idx="${idx}">${label || ''}</li>`)
          .join('')
      }</ul>`;

      this._menuDom = document.createElement('div');
      this._menuDom.innerHTML = cnt;

      this._menuDom.addEventListener('click', this._onMenuClick);
      
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

      this.closeMenu();
    }

    _getMenuPosition() {
      const rootRect = this.getRoot().getBoundingClientRect();
      const menuRect = this._menuDom.getBoundingClientRect();
      let top = Math.floor(rootRect.bottom + window.pageYOffset + menuGap);
      let left = Math.floor(rootRect.left + window.pageXOffset + rootRect.width / 2 - menuRect.width / 2);

      if (this._autoAdjustOverflow) {
        if (left > window.pageXOffset + window.innerWidth - menuRect.width) {
          left = window.pageXOffset + window.innerWidth - menuRect.width - viewportGap;
        } else if (left <= window.pageXOffset) {
          left = window.pageXOffset + viewportGap
        }

        if (top > window.pageYOffset + window.innerHeight - menuRect.height) {
          top = window.pageYOffset + window.innerHeight - menuRect.height - viewportGap;
        }
      }

      return {
        top,
        left
      }
    }

    openMenu(e) {
      e.stopPropagation();
      e.preventDefault();

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
        this._onMenuOpen();
      }

      return this;
    }

    closeMenu() {
      if (this._menuDom) {
        this._hiddenTimer = setTimeout(() => {
          this._menuDom.classList.add(menuHiddenCls);
          this._hiddenTimer = null;
          this._onMenuClose();
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

      this.getRoot().removeEventListener('mouseenter', this.openMenu);
      this.getRoot().removeEventListener('mouseleave', this.closeMenu);

      return this;
    }
  }
})(document);