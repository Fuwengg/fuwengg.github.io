import {projects as originalProjects} from './projects.js';
import {expandedProjects} from './projects-expanded.js';
import {shopProject} from './shop-project.js';
import {filmProjects} from './film-projects.js?v=20261022-tidekeeper';
const groups={straps:'visual',camera:'visual',taohuayuan:'video',jewelry:'visual',heart:'research',filter:'research',studio:'research'};
for(const [id,p]of Object.entries(originalProjects))p.category=groups[id];
originalProjects.heart.gallery=['codex-heart.webp','archive/heart-detail.webp'];
originalProjects.heart.status='本机系统原型，已有安装与历史回归记录；最终验收尚未完成，项目当前暂停。';
export const projects={...filmProjects,taohuayuan:originalProjects.taohuayuan,bailongma:shopProject,headphones:expandedProjects.headphones,shotweaver:expandedProjects.shotweaver,heart:originalProjects.heart,...originalProjects,...expandedProjects};
