import React, {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import TiltedCard from './TiltedCard';
import FlipCard from './FlipCard';
import './site-components.css';
import './viewer-refinement.css';
import './ai-journey.css';
import {initCarousel,initAmbient} from './portfolio-motion';
import {initPointerAtmosphere} from './ambient-pointer';

const covers=['knowledge-board.svg','hotel-project-cover.png','viatrix-final/frame-028.jpg','blind-board.svg','tea-project-preview.webp','nice-house-preview.webp','fangcun-project-preview.webp','longyin-project-preview.webp','longyun-project-preview.webp'];
document.querySelectorAll('.intro-card').forEach((card,i)=>{
  const title=card.getAttribute('href')==='#hotel'?'住前实景册':card.querySelector('h2').innerText;
  card.dataset.title=title;card.dataset.cover='assets/'+covers[i];
  const content='<span class="cover-index">'+String(i+1).padStart(2,'0')+' / 09</span><span class="cover-open">查看项目 ↗</span>';
  card.innerHTML='';
  createRoot(card).render(<><div className="cover-media"><TiltedCard imageSrc={card.dataset.cover} altText={title} containerHeight="100%" imageHeight="100%" imageWidth="100%" rotateAmplitude={4} scaleOnHover={1.015} showTooltip={false} showMobileWarning={false} displayOverlayContent overlayContent={<div className="cover-overlay" dangerouslySetInnerHTML={{__html:content}}/>}/></div><h2 className="attached-card-title">{title}</h2></>);
});
initCarousel();initAmbient();initPointerAtmosphere();

function Detail({front,back,label,structured=false}){
  const ref=useRef(null), [size,setSize]=useState({width:300,height:620}),[open,setOpen]=useState(false);
  useLayoutEffect(()=>{
    const visual=ref.current.closest('.project')?.querySelector('.project-visual');
    const measure=()=>{
      const width=ref.current.clientWidth;
      const heights=[...ref.current.querySelectorAll('.measure-face')].map(el=>el.scrollHeight);
      const pairedHeight=window.matchMedia('(min-width:1051px)').matches?(visual?.getBoundingClientRect().height||0):0;
      const height=Math.max(Math.ceil(Math.max(...heights))+2,Math.ceil(pairedHeight));
      setSize(previous=>previous.width===width&&previous.height===height?previous:{width,height});
    };
    const observer=new ResizeObserver(measure); observer.observe(ref.current);if(visual)observer.observe(visual);measure();
    document.fonts.ready.then(measure);return()=>observer.disconnect();
  },[]);
  const markup=(html,isBack=false)=><div className={'detail-content'+(isBack&&structured?' detail-content--back':'')}><div className="detail-main" dangerouslySetInnerHTML={{__html:html}}/><div className="detail-card-footer" aria-hidden="true"><span>{isBack?'返回项目概览':label}</span><i>{isBack?'−':'＋'}</i></div></div>;
  return <div ref={ref} className="official-detail">
    <div className="measure-box" aria-hidden="true" inert><div className="measure-face">{markup(front)}</div><div className="measure-face">{markup(back,true)}</div></div>
    <FlipCard {...size} front={markup(front)} back={markup(back,true)} flipped={open} onFlipChange={setOpen} tiltMax={3} hoverScale={1.005} glareOpacity={.08} radius={12} background="#f4f4f4" color="#222222" shadowOpacity={.1} ariaLabel={open?'返回项目概览':label}/>
  </div>;
}
const projectBack={
  knowledge:[
    ['回顾结构','对话按任务起因、思考变化、执行动作、产出和未完成事项组织，使后续任务能够找到此前决定的来由。'],
    ['知识边界','知识记录保留来源、作用域、复核时间、当前状态和替代关系。正式规则、个人知识与记忆投影分开管理；用户画像用于理解偏好，不替代新的明确决定。'],
    ['协作与产出','个人负责需求、规则、流程和验收，AI 辅助编写脚本与页面。现有产出包括可检索的回顾页面、知识目录和用户画像文档，并支持增量同步与历史追溯。']
  ],
  hotel:[
    ['产品范围','围绕住宿现场信息的查询与图片共创设计功能边界，把搜索、详情和用户投稿连接为完整的使用流程。'],
    ['内容处理','公开实景照片与用于核验的证明材料分开处理。投稿之后保留审核、纠错、举报、申诉和撤回等环节，便于信息发生变化时继续维护。'],
    ['交付状态','需求与验收由个人负责，AI 辅助实现小程序和云函数。产品已正式上线，当前暂未推广；另有产品手册、测试与部署记录。']
  ],
  viatrix:[
    ['视觉方向','从外骨骼产品如何融入现代潮流出发，整理 CMF 与参考资料，把产品外观、穿戴状态和场景氛围放在同一套视觉语言中考虑。'],
    ['生成与剪辑','个人负责 CMF 设计、Prompt 编写、候选画面筛选修正及剪映剪辑。AI 辅助生成画面，镜头衔接和最终取舍由人工完成。'],
    ['成片结构','叙事由装备细节进入徒步情境，经过溪流、林间与途中休整，再延伸至遗迹、谷地和雪岩坡面，以群山远景收尾。页面展示的 12 张关键帧均取自最终视频。']
  ],
  tea:[
    ['使用问题','手持采茶需要持续握持设备，还要在移动作业中完成采摘和茶叶收集。方案将支撑、握持与集叶作为相互关联的动作处理。'],
    ['结构调整','肩带承担辅助支撑；握柄围绕手掌接触、发力和防滑进行调整；采摘端与集叶路径配合连续作业。'],
    ['方案表达','个人完成方案设计与完善，AI 辅助表达，形成产品外观、尺寸、使用流程和结构细节版面。']
  ],
  'nice-house':[
    ['生活场景','从独居青年的床边活动出发，梳理睡前和起床后常用物品的放置、取用、充电与照明需求。'],
    ['组合设计','床和床头柜作为一组家具设计，按床边活动顺序安排功能位置，同时协调收纳方式和整体外观。'],
    ['方案表达','个人负责方案设计，AI 辅助完成效果表达，形成家具组合方案及卧室场景效果图。']
  ],
  fangcun:[
    ['移动工作空间','将配送电动车视为骑手的移动工作空间，区分纸巾、充电宝、雨具和证件等物品的使用频率。'],
    ['取物动作','按取用频率划分储物区域，探索侧向抽屉的开启方式、位置及与车身的整合关系，围绕停车后的取物动作安排空间。'],
    ['方案表达','个人负责方案设计，AI 辅助表达，形成车身模型、储物结构和场景效果图。']
  ],
  longyin:[
    ['策划切入','围绕龙游的地方美食、戏曲与自然景观组织文旅路线和活动内容，使分散的文化线索进入可参与的游览体验。'],
    ['个人工作','在团队中主要负责活动文案设计与策划，梳理路线主题和文字表达；完成徽章（吧唧）与图片贴图等部分视觉应用。'],
    ['团队成果','方案获浙江省第十四届会展策划创意大赛团队三等奖。']
  ],
  longyun:[
    ['主题定位','围绕龙游美食品牌的业态提升和宣传推广，以“龙运食厢，游了有米”串联地方饮食与商帮文化。'],
    ['个人工作','在团队中主要负责活动文案设计与策划，将主题转化为具体活动内容和文字表达，配合完成方案呈现。'],
    ['团队成果','方案获全国会展策划创意大赛团队一等奖。']
  ]
};
function makeProjectBack(id,label,fallback){
  const sections=projectBack[id];if(!sections)return `<h3>${label}</h3>${fallback}`;
  return `<div class="detail-back-header"><span class="detail-back-kicker">PROJECT PROCESS</span><h3>${label}</h3></div><div class="detail-back-sections">${sections.map(([title,body])=>`<section class="detail-back-section"><h4>${title}</h4><p>${body}</p></section>`).join('')}</div>`;
}
document.querySelectorAll('.project-copy').forEach(copy=>{
  const details=copy.querySelector('details');if(!details)return;
  const label=details.querySelector('summary').childNodes[0].textContent.trim();
  const id=copy.closest('article')?.id;
  const back=makeProjectBack(id,label,details.querySelector('.detail-body').innerHTML);
  details.remove(); const front=copy.innerHTML;copy.innerHTML='';
  createRoot(copy).render(<Detail {...{front,back,label}} structured={Boolean(projectBack[id])}/>);
});
const methodCard=document.querySelector('.method-grid[aria-controls="method-drawer"]');
const methodDrawer=document.getElementById('method-drawer');
if(methodCard&&methodDrawer){
  const toggleMethod=()=>{
    const open=methodCard.getAttribute('aria-expanded')!=='true';
    methodCard.setAttribute('aria-expanded',String(open));
    methodCard.setAttribute('aria-label',`${open?'收起':'展开'}维护、迁移与 Harness 实践`);
    methodDrawer.classList.toggle('is-open',open);
    methodDrawer.setAttribute('aria-hidden',String(!open));
    methodDrawer.inert=!open;
  };
  methodCard.addEventListener('click',toggleMethod);
  methodCard.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleMethod();}
  });
}
