document.addEventListener('DOMContentLoaded', () => {
  const menuConfig = [{
    label: '一句话简介',
    onClick: () => {
      alert('学前端，来之道 —— 陪伴式自学前端圈子');
    }
  }, {
    label: '之道前端的使命',
    onClick: () => {
      alert('提升前端开发的职业天花板，延长前端开发的职业寿命');
    }
  }, {
    label: '之道前端的愿景',
    onClick: () => {
      alert('打造万人共学前端圈子');
    }
  }, {
    label: '查看介绍',
    onClick: () => {
      window.open('https://kcnrozgf41zs.feishu.cn/wiki/PBj0w5rjUiEWVgktZE0caKOunNc');
    }
  }];
  
  const dropdown1 = new Dropdown({
    id: 'dd1',
    menu: menuConfig
  });

  const btn1 = new Button({
    id: 'btn1',
    onClick: () => {
      dropdown1.setTriggerType(Dropdown.TRIGGER_TYPE.HOVER);
    }
  });

  const btn2 = new Button({
    id: 'btn2',
    onClick: () => {
      dropdown1.setTriggerType(Dropdown.TRIGGER_TYPE.CLICK);
    }
  });

  const btn3 = new Button({
    id: 'btn3',
    onClick: () => {
      dropdown1.setTriggerType(Dropdown.TRIGGER_TYPE.CONTEXTMENU);
    }
  });

  const dropdown2 = new Dropdown({
    id: 'dd2',
    menu: () => {
      const img = document.createElement('img');
      img.classList.add('img');
      img.src = './assets/logo.jpg';

      return img;
    }
  });

  const dropdown3 = new Dropdown({
    id: 'dd3',
    menu: document.getElementById('testimg')
  });

  const dropdown4 = new Dropdown({
    id: 'dd4',
    cls: 'top-left',
    autoAdjustOverflow: true,
    menu: menuConfig
  });

  const dropdown5 = new Dropdown({
    id: 'dd5',
    cls: 'top-right',
    autoAdjustOverflow: true,
    menu: menuConfig
  });

  const dropdown6 = new Dropdown({
    id: 'dd6',
    cls: 'bottom-left',
    autoAdjustOverflow: true,
    menu: menuConfig
  });

  const dropdown7 = new Dropdown({
    id: 'dd7',
    cls: 'bottom-right',
    autoAdjustOverflow: true,
    menu: menuConfig
  });
});
