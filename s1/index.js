document.addEventListener('DOMContentLoaded', () => {
  const dropdown = new Dropdown({
    id: 'dd',
    menu: [{
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
    }]
  });
});
