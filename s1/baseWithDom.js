const BaseComWithDom = ((document) => {
  return class {
    _dom;
    _cls;

    constructor(props = {}) {
      const { root, id, cls } = props;

      if (root && root instanceof HTMLElement) {
        this._dom = root;
      } else if (id) {
        this._dom = document.getElementById(id);
        if (!this._dom) {
          throw new TypeError(`找不到 id 为 ${id} 的元素`);
        }
      } else {
        throw new TypeError('必须要提供 root 或者 id 参数');
      }

      this._cls = cls;
      if (this._cls) {
        this.resetClassName();
      }

      this.init(props);
    }

    init() {
      throw new Error('必须要实现 init 方法');
    }

    getRoot() {
      return this._dom;
    }

    addClassName(cls) {
      if (cls) {
        this._dom.classList.add(...cls.split(/\s+/));
      }

      return this;
    }

    removeClassName(cls) {
      if (cls) {
        this._dom.classList.remove(...cls.split(/\s+/));
      }

      return this;
    }

    resetClassName() {
      this._dom.className = this._cls || '';

      return this;
    }
  }
})(document);