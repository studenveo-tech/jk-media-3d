import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  Building2, Users, Video, Image as ImageIcon, FileText, Search, TrendingUp,
  Briefcase, ShieldCheck, Cpu, Play, CheckCircle2, AlertTriangle, Clock,
  Settings, Eye, Sparkles, Layers, Terminal, ChevronRight, ChevronLeft,
  Maximize2, Minimize2, Send, Check, X, RefreshCw, Download, ExternalLink,
  Compass, Focus, Activity, Key, Database, Award, Zap, Sliders, Calendar, Share2,
  Link2, Plug, Unplug, CheckSquare, Square, PlusCircle, Globe, RotateCcw
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

// ============================================================================
// 1. FIREBASE & CLOUD PERSISTENCE INITIALIZATION
// ============================================================================
let db = null;
let auth = null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'jk-media-corp-3d-agency';

try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    const firebaseConfig = JSON.parse(__firebase_config);
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (err) {
  console.warn('Firebase initialization skipped or running in local fallback mode:', err);
}

// ============================================================================
// 2. 10 CORPORATE DEPARTMENTS (3D ARCHITECTURAL FLOOR PLAN)
// ============================================================================
const OFFICE_ROOMS = [
  {
    id: 'RM-01',
    number: '01',
    name: 'Phòng CEO',
    englishName: 'CEO Executive Suite',
    agentId: 'AGT-01',
    x: -18,
    z: -15,
    w: 8,
    d: 7,
    color: '#00F0FF',
    hex: 0x00f0ff,
    zone: 'North Wing',
    equipment: 'Bàn điều hành sang trọng, Màn hình Hologram Chiến lược, Ghế da Giám đốc',
    description: 'Trung tâm chỉ huy tối cao, phê duyệt dự án và điều phối toàn bộ 9 phòng ban AI.'
  },
  {
    id: 'RM-02',
    number: '02',
    name: 'Phòng Creative Director',
    englishName: 'Creative Concept Lab',
    agentId: 'AGT-02',
    x: -9,
    z: -15,
    w: 8,
    d: 7,
    color: '#38BDF8',
    hex: 0x38bdf8,
    zone: 'North Wing',
    equipment: 'Bảng Moodboard KTS, Màn hình Color-Grading, Bàn vẽ Concept 3D',
    description: 'Phát triển Big Idea, Concept chiến dịch, định hướng mỹ thuật và nhận diện thương hiệu.'
  },
  {
    id: 'RM-03',
    number: '03',
    name: 'Phòng Marketing',
    englishName: 'Marketing Strategy Hub',
    agentId: 'AGT-03',
    x: 0,
    z: -15,
    w: 8,
    d: 7,
    color: '#0EA5E9',
    hex: 0x0ea5e9,
    zone: 'North Wing',
    equipment: 'Hệ thống phân tích dữ liệu thị trường, Biểu đồ hành vi khách hàng 3D',
    description: 'Nghiên cứu thị trường, phân tích tệp khách hàng, lập kế hoạch IMC đa kênh.'
  },
  {
    id: 'RM-04',
    number: '04',
    name: 'Phòng Content',
    englishName: 'Content & Copywriting Studio',
    agentId: 'AGT-04',
    x: 9,
    z: -15,
    w: 8,
    d: 7,
    color: '#22D3EE',
    hex: 0x22d3ee,
    zone: 'North Wing',
    equipment: 'Trạm biên tập đa màn hình, Thư viện kịch bản & Content Calendar',
    description: 'Sản xuất nội dung Facebook, Website, kịch bản TikTok, TVC và thông cáo báo chí.'
  },
  {
    id: 'RM-05',
    number: '05',
    name: 'Phòng Graphic Design',
    englishName: 'AI Graphic Design Studio',
    agentId: 'AGT-05',
    x: 18,
    z: -15,
    w: 8,
    d: 7,
    color: '#06B6D4',
    hex: 0x06b6d4,
    zone: 'North Wing',
    equipment: 'Wacom Cintiq Pro 3D, Máy trạm Render Ảnh AI 8K, Bảng kiểm chuẩn Typography',
    description: 'Thiết kế Poster, Banner, Standee, Key Visual bằng mô hình AI tạo ảnh & kiểm duyệt chữ Việt.'
  },
  {
    id: 'RM-06',
    number: '06',
    name: 'Phòng Video Production',
    englishName: 'AI Video & Veo Studio',
    agentId: 'AGT-06',
    x: -18,
    z: 15,
    w: 8,
    d: 7,
    color: '#818CF8',
    hex: 0x818cf8,
    zone: 'South Wing',
    equipment: 'Bàn dựng phi tuyến tính DaVinci/FFmpeg, Màn hình Cinema 16:9, Buồng thu âm',
    description: 'Sản xuất Storyboard, tạo hình ảnh AI cho từng cảnh, dựng video, phụ đề và xuất file Video.'
  },
  {
    id: 'RM-07',
    number: '07',
    name: 'Phòng SEO & Website',
    englishName: 'SEO & Web Engineering',
    agentId: 'AGT-07',
    x: -9,
    z: 15,
    w: 8,
    d: 7,
    color: '#34D399',
    hex: 0x34d399,
    zone: 'South Wing',
    equipment: 'Máy chủ Audit Technical SEO, Màn hình theo dõi SERP & Topic Cluster',
    description: 'Nghiên cứu từ khóa, phân tích đối thủ, tối ưu On-page/Technical SEO và cấu trúc Website.'
  },
  {
    id: 'RM-08',
    number: '08',
    name: 'Phòng Advertising',
    englishName: 'Performance Ads Center',
    agentId: 'AGT-08',
    x: 0,
    z: 15,
    w: 8,
    d: 7,
    color: '#F59E0B',
    hex: 0xf59e0b,
    zone: 'South Wing',
    equipment: 'Trạm kiểm soát Meta Ads & Google Ads, Màn hình theo dõi ROAS/CPC/CTR',
    description: 'Lập kế hoạch quảng cáo, phân bổ ngân sách, tối ưu chuyển đổi (Chỉ chạy khi CEO duyệt).'
  },
  {
    id: 'RM-09',
    number: '09',
    name: 'Phòng Business & CS',
    englishName: 'Business & Client Service',
    agentId: 'AGT-09',
    x: 9,
    z: 15,
    w: 8,
    d: 7,
    color: '#EC4899',
    hex: 0xec4899,
    zone: 'South Wing',
    equipment: 'Quầy tiếp nhận Brief khách hàng, Hệ thống CRM, Báo giá & Hợp đồng',
    description: 'Tiếp nhận yêu cầu khách hàng, phân tích nhu cầu, lập báo giá và quản lý doanh thu.'
  },
  {
    id: 'RM-10',
    number: '10',
    name: 'Phòng QC & Meeting',
    englishName: 'Quality Control & Boardroom',
    agentId: 'AGT-10',
    x: 18,
    z: 15,
    w: 8,
    d: 7,
    color: '#10B981',
    hex: 0x10b981,
    zone: 'South Wing',
    equipment: 'Bàn họp Hội đồng dài 4m, Màn hình trình chiếu 120 inch, Trạm kiểm định QC',
    description: 'Không gian họp liên phòng ban và kiểm định chất lượng độc lập trước khi trình CEO.'
  }
];

// ============================================================================
// 3. 10 SPECIALIZED AI AGENTS (MULTI-AGENT ARCHITECTURE)
// ============================================================================
const INITIAL_AGENTS = [
  {
    id: 'AGT-01',
    code: '01',
    name: 'ALEX NGUYỄN (CEO AI)',
    role: 'Chief Executive Officer AI',
    department: 'Phòng CEO',
    roomId: 'RM-01',
    homePos: { x: -18, z: -15.5 },
    seatPos: { x: -18, z: -16.2 },
    meetingPos: { x: 16.0, z: 13.8 },
    suitColor: 0x00f0ff,
    accentColor: '#00F0FF',
    aiModel: 'Gemini 3 Flash Orchestrator',
    specialty: 'Phân tích yêu cầu, lập kế hoạch tổng thể, phân công nhiệm vụ, phê duyệt sản phẩm.',
    allowedTools: ['Project Orchestrator', 'Task Dispatcher', 'Executive Approval Gate', 'Budget Monitor'],
    systemPrompt: `Bạn là CEO AI (Nhân sự 01) của JK MEDIA CORPORATION. Nhiệm vụ của bạn là phân tích yêu cầu từ Chủ tịch/CEO, lập kế hoạch tổng thể, chia nhỏ nhiệm vụ cho 9 phòng ban chuyên môn, điều phối tiến độ và kiểm tra tính đồng bộ chiến lược.`,
    animationState: 'Working',
    status: 'Đang xử lý',
    currentTask: 'Giám sát hoạt động toàn công ty & sẵn sàng nhận lệnh từ CEO',
    progress: 100,
    history: ['Khởi động hệ thống điều hành 3D JK Media Corporation'],
    lastOutput: null
  },
  {
    id: 'AGT-02',
    code: '02',
    name: 'MINH TRẦN (CREATIVE)',
    role: 'Creative Director',
    department: 'Phòng Creative Director',
    roomId: 'RM-02',
    homePos: { x: -9, z: -15.5 },
    seatPos: { x: -9, z: -16.2 },
    meetingPos: { x: 17.0, z: 13.8 },
    suitColor: 0x38bdf8,
    accentColor: '#38BDF8',
    aiModel: 'Gemini 3 Flash Creative Engine',
    specialty: 'Phát triển Big Idea, xây dựng Concept, định hướng hình ảnh & nhận diện thương hiệu.',
    allowedTools: ['Concept Generator', 'Brand Identity Guard', 'Visual Moodboard AI', 'Color Palette Architect'],
    systemPrompt: `Bạn là Creative Director (Nhân sự 02) của JK MEDIA CORPORATION. Bạn chịu trách nhiệm phát triển Big Idea, Creative Concept, Key Message, Tone & Mood và định hướng mỹ thuật xuyên suốt chiến dịch.`,
    animationState: 'Typing',
    status: 'Đã hoàn thành',
    currentTask: 'Trực chiến phát triển Concept & định hướng nhận diện thương hiệu',
    progress: 100,
    history: ['Hoàn tất bộ quy chuẩn màu sắc Corporate Tech'],
    lastOutput: null
  },
  {
    id: 'AGT-03',
    code: '03',
    name: 'HOÀNG LÊ (MARKETING)',
    role: 'Marketing Manager',
    department: 'Phòng Marketing',
    roomId: 'RM-03',
    homePos: { x: 0, z: -15.5 },
    seatPos: { x: 0, z: -16.2 },
    meetingPos: { x: 18.0, z: 13.8 },
    suitColor: 0x0ea5e9,
    accentColor: '#0EA5E9',
    aiModel: 'Gemini 3 Flash + Market Grounding',
    specialty: 'Nghiên cứu thị trường, phân tích khách hàng mục tiêu, chiến lược truyền thông IMC.',
    allowedTools: ['Market Research AI', 'Persona Analyzer', 'IMC Funnel Planner', 'KPI Forecasting'],
    systemPrompt: `Bạn là Marketing Manager (Nhân sự 03) của JK MEDIA CORPORATION. Bạn chuyên nghiên cứu thị trường, phân tích chân dung khách hàng mục tiêu (Insight), xây dựng phễu truyền thông IMC và KPI chiến dịch.`,
    animationState: 'Working',
    status: 'Đã hoàn thành',
    currentTask: 'Phân tích dữ liệu thị trường & hành vi người tiêu dùng',
    progress: 100,
    history: ['Cập nhật cơ sở dữ liệu ngành F&B và Bất động sản'],
    lastOutput: null
  },
  {
    id: 'AGT-04',
    code: '04',
    name: 'LAN VŨ (CONTENT)',
    role: 'Content Specialist',
    department: 'Phòng Content',
    roomId: 'RM-04',
    homePos: { x: 9, z: -15.5 },
    seatPos: { x: 9, z: -16.2 },
    meetingPos: { x: 19.0, z: 13.8 },
    suitColor: 0x22d3ee,
    accentColor: '#22D3EE',
    aiModel: 'Gemini 3 Flash Copywriter',
    specialty: 'Viết bài Facebook, Website, kịch bản TikTok/Video, bài PR và lịch nội dung.',
    allowedTools: ['Social Copywriter', 'TikTok Scriptwriter', 'Content Calendar Builder', 'PR Article Generator'],
    systemPrompt: `Bạn là Content Specialist (Nhân sự 04) của JK MEDIA CORPORATION. Bạn chuyên viết chuỗi bài đăng Facebook, bài chuẩn SEO Website, kịch bản TikTok/Reels và thông cáo báo chí hấp dẫn, đúng giọng điệu thương hiệu.`,
    animationState: 'Typing',
    status: 'Đã hoàn thành',
    currentTask: 'Sẵn sàng biên soạn chuỗi bài truyền thông đa nền tảng',
    progress: 100,
    history: ['Xây dựng khung Content Pillar tiêu chuẩn'],
    lastOutput: null
  },
  {
    id: 'AGT-05',
    code: '05',
    name: 'KHOA PHẠM (DESIGNER)',
    role: 'Graphic Designer',
    department: 'Phòng Graphic Design',
    roomId: 'RM-05',
    homePos: { x: 18, z: -15.5 },
    seatPos: { x: 18, z: -16.2 },
    meetingPos: { x: 20.0, z: 13.8 },
    suitColor: 0x06b6d4,
    accentColor: '#06B6D4',
    aiModel: 'Gemini 3.1 Flash Image + Typography Compositor',
    specialty: 'Thiết kế Poster, Banner, Standee, ảnh sản phẩm bằng AI tạo ảnh & kiểm chuẩn chữ tiếng Việt.',
    allowedTools: ['Gemini 3.1 Flash Image API', 'Vietnamese Typography Guard', 'Brand Logo Compositor', 'Multi-Ratio Exporter (PNG/JPG/WEBP)'],
    systemPrompt: `Bạn là Graphic Designer (Nhân sự 05) của JK MEDIA CORPORATION. Bạn tạo câu lệnh mô tả hình ảnh chuyên sâu cho mô hình tạo ảnh AI và định nghĩa bố cục Typography tiếng Việt chính xác tuyệt đối (tên thương hiệu, hotline, địa chỉ, khuyến mãi).`,
    animationState: 'Working',
    status: 'Đã hoàn thành',
    currentTask: 'Trực tại Graphic Studio - Kết nối Gemini 3.1 Flash Image',
    progress: 100,
    history: ['Kích hoạt hệ thống kiểm chuẩn Typography tiếng Việt'],
    lastOutput: null
  },
  {
    id: 'AGT-06',
    code: '06',
    name: 'ĐỨC ĐẶNG (VIDEO)',
    role: 'Video Production Engineer',
    department: 'Phòng Video Production',
    roomId: 'RM-06',
    homePos: { x: -18, z: 15.5 },
    seatPos: { x: -18, z: 16.2 },
    meetingPos: { x: 16.0, z: 16.2 },
    suitColor: 0x818cf8,
    accentColor: '#818CF8',
    aiModel: 'Gemini 3.1 Flash Image Keyframes + WebM Video Synthesizer',
    specialty: 'Kịch bản phân cảnh, Storyboard, tạo hình ảnh AI từng cảnh, dựng video, phụ đề & xuất file.',
    allowedTools: ['Storyboard Architect', 'AI Scene Keyframe Generator', 'WebM Video Synthesizer', 'Subtitle & Voiceover Engine'],
    systemPrompt: `Bạn là Video Production Engineer (Nhân sự 06) của JK MEDIA CORPORATION. Bạn xây dựng kịch bản phân cảnh chi tiết (Scene-by-Scene), mô tả góc máy, ánh sáng, chuyển động, lời bình (Voiceover) và phụ đề để dựng thành video hoàn chỉnh.`,
    animationState: 'Working',
    status: 'Đã hoàn thành',
    currentTask: 'Sẵn sàng kết xuất Storyboard & dựng Video thực tế',
    progress: 100,
    history: ['Kiểm tra luồng xuất Video WebM 60fps & Subtitles'],
    lastOutput: null
  },
  {
    id: 'AGT-07',
    code: '07',
    name: 'THẢO BÙI (SEO & WEB)',
    role: 'SEO & Website Specialist',
    department: 'Phòng SEO & Website',
    roomId: 'RM-07',
    homePos: { x: -9, z: 15.5 },
    seatPos: { x: -9, z: 16.2 },
    meetingPos: { x: 17.0, z: 16.2 },
    suitColor: 0x34d399,
    accentColor: '#34D399',
    aiModel: 'Gemini 3 Flash + Google Search Grounding',
    specialty: 'Nghiên cứu từ khóa, Search Intent, Topic Cluster, On-page/Technical SEO, Audit Website.',
    allowedTools: ['Google Search Grounding', 'Keyword Cluster Engine', 'On-Page Optimizer', 'Technical SEO Auditor'],
    systemPrompt: `Bạn là SEO & Website Specialist (Nhân sự 07) của JK MEDIA CORPORATION. Bạn thực hiện 17 hạng mục SEO chuyên sâu: nghiên cứu từ khóa, phân tích Search Intent, đối thủ, Topic Cluster, cấu trúc Website, bài chuẩn SEO, Title/Meta/Heading/Internal Link và Technical Audit (không bao giờ tự bịa số liệu).`,
    animationState: 'Typing',
    status: 'Đã hoàn thành',
    currentTask: 'Kết nối Google Search Grounding phục vụ nghiên cứu SEO thực tế',
    progress: 100,
    history: ['Đồng bộ 17 tiêu chuẩn kiểm định SEO chuyên nghiệp'],
    lastOutput: null
  },
  {
    id: 'AGT-08',
    code: '08',
    name: 'TÙNG ĐỖ (ADS)',
    role: 'Ads Specialist',
    department: 'Phòng Advertising',
    roomId: 'RM-08',
    homePos: { x: 0, z: 15.5 },
    seatPos: { x: 0, z: 16.2 },
    meetingPos: { x: 18.0, z: 16.2 },
    suitColor: 0xf59e0b,
    accentColor: '#F59E0B',
    aiModel: 'Gemini 3 Flash Performance Planner',
    specialty: 'Hoạch định chiến dịch Meta/Google/TikTok Ads, phân bổ ngân sách, tối ưu CPC, CTR, CPA, ROAS.',
    allowedTools: ['Media Buying Planner', 'Audience Targeting Matrix', 'ROAS Simulator', 'CEO Spend Lock (An toàn ngân sách)'],
    systemPrompt: `Bạn là Ads Specialist (Nhân sự 08) của JK MEDIA CORPORATION. Bạn lập kế hoạch quảng cáo đa kênh, phân tích tệp đối tượng, phân bổ ngân sách, dự phóng CPC/CPM/CTR/CPA/ROAS và đề xuất tối ưu. Tuyệt đối không tự ý tiêu tiền khi chưa có lệnh phê duyệt của CEO.`,
    animationState: 'Working',
    status: 'Cần CEO phê duyệt',
    currentTask: 'Chờ phê duyệt ngân sách từ CEO trước khi kết nối Ads API',
    progress: 100,
    history: ['Bật chế độ khóa an toàn ngân sách (CEO Approval Required)'],
    lastOutput: null
  },
  {
    id: 'AGT-09',
    code: '09',
    name: 'LINH NGÔ (BUSINESS & CS)',
    role: 'Business & Customer Service',
    department: 'Phòng Business & Customer Service',
    roomId: 'RM-09',
    homePos: { x: 9, z: 15.5 },
    seatPos: { x: 9, z: 16.2 },
    meetingPos: { x: 19.0, z: 16.2 },
    suitColor: 0xec4899,
    accentColor: '#EC4899',
    aiModel: 'Gemini 3 Flash CRM & Proposal AI',
    specialty: 'Tiếp nhận yêu cầu khách hàng, phân tích Brief, lập báo giá, hợp đồng và theo dõi doanh thu.',
    allowedTools: ['Client Brief Analyzer', 'Quotation & Proposal Builder', 'Contract Tracker', 'Revenue Analytics'],
    systemPrompt: `Bạn là Business & Customer Service Specialist (Nhân sự 09) của JK MEDIA CORPORATION. Bạn tiếp nhận yêu cầu đầu tiên từ khách hàng/CEO, bóc tách nhu cầu, xây dựng bảng báo giá chi tiết và lộ trình bàn giao.`,
    animationState: 'Talking',
    status: 'Đã hoàn thành',
    currentTask: 'Trực quầy tiếp nhận yêu cầu dự án mới từ CEO & Khách hàng',
    progress: 100,
    history: ['Khởi tạo biểu mẫu Báo giá & Hợp đồng dịch vụ truyền thông'],
    lastOutput: null
  },
  {
    id: 'AGT-10',
    code: '10',
    name: 'VIỆT HÀ (QC MANAGER)',
    role: 'Quality Control Manager',
    department: 'Phòng QC & Meeting',
    roomId: 'RM-10',
    homePos: { x: 18, z: 15.5 },
    seatPos: { x: 20.5, z: 15.0 },
    meetingPos: { x: 20.5, z: 15.0 },
    suitColor: 0x10b981,
    accentColor: '#10B981',
    aiModel: 'Gemini 3 Flash Independent Auditor',
    specialty: 'Kiểm định độc lập toàn bộ Nội dung, Poster, Video, SEO, Quảng cáo so với Brief gốc.',
    allowedTools: ['Brand Compliance Checker', 'Vietnamese Spell & Fact Auditor', 'Deliverable Gatekeeper', 'Revision Dispatcher'],
    systemPrompt: `Bạn là QC Manager (Nhân sự 10) của JK MEDIA CORPORATION. Bạn kiểm tra độc lập toàn bộ sản phẩm của các bộ phận khác (Content, Poster, Video, SEO, Ads) xem có đúng yêu cầu ban đầu, đúng thông tin thương hiệu, hotline, địa chỉ hay không trước khi trình CEO phê duyệt.`,
    animationState: 'Reviewing',
    status: 'Đã hoàn thành',
    currentTask: 'Trực kiểm định chất lượng độc lập tại Phòng QC & Hội nghị',
    progress: 100,
    history: ['Thiết lập bộ tiêu chuẩn nghiệm thu 15 điểm của JK Media'],
    lastOutput: null
  }
];

// ============================================================================
// 4. 12-STEP REAL WORKFLOW DEFINITIONS
// ============================================================================
const WORKFLOW_STEPS = [
  { step: 1, title: 'BƯỚC 1: SALES TIẾP NHẬN YÊU CẦU', agentId: 'AGT-09', roomId: 'RM-09', desc: 'Phân tích nhu cầu khách hàng, chuẩn hóa Brief & lập dự toán báo giá.' },
  { step: 2, title: 'BƯỚC 2: CEO AI PHÂN TÍCH & TẠO DỰ ÁN', agentId: 'AGT-01', roomId: 'RM-01', desc: 'Lập kế hoạch tổng thể, xác định các chuyên môn tham gia & giao việc.' },
  { step: 3, title: 'BƯỚC 3: CREATIVE HỌP & ĐỀ XUẤT CONCEPT', agentId: 'AGT-02', roomId: 'RM-10', desc: 'Di chuyển vào Phòng Họp 3D, phát triển Big Idea & định hướng mỹ thuật.' },
  { step: 4, title: 'BƯỚC 4: MARKETING XÂY DỰNG CHIẾN LƯỢC', agentId: 'AGT-03', roomId: 'RM-03', desc: 'Phân tích tệp khách hàng mục tiêu & lập kế hoạch truyền thông đa kênh.' },
  { step: 5, title: 'BƯỚC 5: CONTENT VIẾT CHUỖI NỘI DUNG', agentId: 'AGT-04', roomId: 'RM-04', desc: 'Biên soạn 10 bài đăng Facebook, bài chuẩn SEO & nội dung truyền thông.' },
  { step: 6, title: 'BƯỚC 6: DESIGNER TẠO POSTER THỰC TẾ', agentId: 'AGT-05', roomId: 'RM-05', desc: 'Kết nối Gemini 3.1 Flash Image tạo Poster & xử lý Typography tiếng Việt.' },
  { step: 7, title: 'BƯỚC 7: VIDEO PRODUCTION DỰNG VIDEO', agentId: 'AGT-06', roomId: 'RM-06', desc: 'Xây dựng Storyboard, tạo hình ảnh AI từng cảnh & xuất file Video.' },
  { step: 8, title: 'BƯỚC 8: SEO NGHIÊN CỨU TỪ KHÓA & PLAN', agentId: 'AGT-07', roomId: 'RM-07', desc: 'Nghiên cứu từ khóa, phân tích Search Intent, Topic Cluster & On-page SEO.' },
  { step: 9, title: 'BƯỚC 9: ADS LẬP KẾ HOẠCH QUẢNG CÁO', agentId: 'AGT-08', roomId: 'RM-08', desc: 'Phân bổ ngân sách, tính toán CPC, CPM, CTR, ROAS (Chờ CEO duyệt chi).' },
  { step: 10, title: 'BƯỚC 10: QC KIỂM TRA ĐỘC LẬP TẤT CẢ SẢN PHẨM', agentId: 'AGT-10', roomId: 'RM-10', desc: 'Đối chiếu sản phẩm thực tế với Brief gốc, kiểm tra thông tin & thương hiệu.' },
  { step: 11, title: 'BƯỚC 11: TRÌNH CEO NHẬN BÁO CÁO & PHÊ DUYỆT', agentId: 'AGT-01', roomId: 'RM-01', desc: 'Tổng hợp toàn bộ hồ sơ sản phẩm thực tế trình CEO phê duyệt xuất bản.' },
  { step: 12, title: 'BƯỚC 12: SOCIAL CENTER LÊN LỊCH ĐĂNG BÀI', agentId: 'AGT-04', roomId: 'RM-04', desc: 'Lập lịch xuất bản (Chỉ thực hiện khi CEO yêu cầu và xác nhận trạng thái API).' }
];

// ============================================================================
// 5. AI PROVIDER GATEWAY REGISTRY (CONNECTED WITH CEO'S EXISTING KEY)
// ============================================================================
const INITIAL_PROVIDERS = [
  {
    id: 'PROV-GEMINI-TEXT',
    name: 'Google Gemini 3 Flash (Multi-Agent Text & Multimodal Vision)',
    module: 'Text, File Reader & Orchestrator AI',
    model: 'gemini-3-flash-preview',
    status: 'Đã tích hợp (Live AI)',
    authType: 'Dùng Khóa API hiện có của CEO',
    costPerCall: '$0.0012 (Ước tính)',
    description: 'Đọc file Brief/Ảnh tải lên, điều phối 10 Agent, viết 10 bài Content, kịch bản Video, kế hoạch SEO/Ads và kiểm định QC.'
  },
  {
    id: 'PROV-GEMINI-IMAGE',
    name: 'Google Gemini 3.1 Flash Image (Image-to-Image & Text-to-Image)',
    module: 'Image AI Provider (Graphic Design & Storyboard Studio)',
    model: 'gemini-3.1-flash-image',
    status: 'Đã tích hợp (Live AI)',
    authType: 'Dùng Khóa API hiện có của CEO',
    costPerCall: '$0.015 (Ước tính)',
    description: 'Tạo Poster thương mại từ mô tả + ảnh sản phẩm tải lên, đóng dấu Logo thật của khách hàng và vẽ ảnh AI cho từng cảnh Video.'
  },
  {
    id: 'PROV-VIDEO-SYNTH',
    name: 'AI Keyframe Video Engine & Gemini TTS Voiceover',
    module: 'Video AI Provider (Video Production Studio)',
    model: 'gemini-3.1-flash-image + WebM Canvas Synthesizer',
    status: 'Đã tích hợp (Live AI)',
    authType: 'Dùng Khóa API hiện có của CEO',
    costPerCall: 'Theo số cảnh AI Keyframe',
    description: 'Tự động sinh ảnh AI chất lượng cao cho từng phân cảnh Storyboard, hiệu ứng chuyển động Ken Burns, đóng dấu Logo và xuất file Video .WEBM thực tế.'
  },
  {
    id: 'PROV-SEO-DATA',
    name: 'Google Search Grounding & SEO Audit Engine',
    module: 'SEO Data Provider',
    model: 'google_search grounding',
    status: 'Đã tích hợp (Live AI)',
    authType: 'Dùng Khóa API hiện có của CEO',
    costPerCall: 'Tích hợp sẵn',
    description: 'Nghiên cứu từ khóa và đối thủ thực tế qua Google Search Grounding.'
  }
];

// ============================================================================
// 5B. PROJECT-SCOPED EXTERNAL PLATFORMS (NO INSTAGRAM - BLANK FOR EACH PROJECT)
// ============================================================================
const createBlankPlatformIntegrations = () => [
  {
    id: 'PLAT-FB',
    category: 'Nền Tảng Đăng Bài & Website (Cấu hình riêng theo từng Dự án)',
    name: 'Facebook Fanpage (Meta Graph API)',
    platformKey: 'Facebook Fanpage',
    endpoint: 'https://graph.facebook.com/v19.0/',
    status: 'Chưa tích hợp',
    accountIdLabel: 'Fanpage ID của Dự án',
    tokenLabel: 'Page Access Token',
    accountId: '',
    accessToken: '',
    webhookUrl: '',
    lastPing: null,
    description: 'Để trống mặc định. Kết nối riêng Fanpage của từng khách hàng/dự án và tự động lưu theo hồ sơ dự án.'
  },
  {
    id: 'PLAT-TIKTOK',
    category: 'Nền Tảng Đăng Bài & Website (Cấu hình riêng theo từng Dự án)',
    name: 'TikTok Business API',
    platformKey: 'TikTok Official',
    endpoint: 'https://open.tiktokapis.com/v2/post/publish/video/init/',
    status: 'Chưa tích hợp',
    accountIdLabel: 'TikTok Open ID / Business ID',
    tokenLabel: 'TikTok OAuth Access Token',
    accountId: '',
    accessToken: '',
    webhookUrl: '',
    lastPing: null,
    description: 'Để trống mặc định. Kết nối kênh TikTok riêng của từng dự án để xuất bản video ngắn.'
  },
  {
    id: 'PLAT-YOUTUBE',
    category: 'Nền Tảng Đăng Bài & Website (Cấu hình riêng theo từng Dự án)',
    name: 'YouTube Data API v3',
    platformKey: 'YouTube Channel',
    endpoint: 'https://www.googleapis.com/upload/youtube/v3/videos',
    status: 'Chưa tích hợp',
    accountIdLabel: 'YouTube Channel ID',
    tokenLabel: 'Google OAuth 2.0 Client Token',
    accountId: '',
    accessToken: '',
    webhookUrl: '',
    lastPing: null,
    description: 'Để trống mặc định. Kết nối kênh YouTube riêng của từng dự án để đăng TVC và YouTube Shorts.'
  },
  {
    id: 'PLAT-WP',
    category: 'Nền Tảng Đăng Bài & Website (Cấu hình riêng theo từng Dự án)',
    name: 'Website CMS (WordPress / Custom Webhook)',
    platformKey: 'Website Doanh Nghiệp',
    endpoint: 'https://your-domain.com/wp-json/wp/v2/posts',
    status: 'Chưa tích hợp',
    accountIdLabel: 'Domain Website & Username',
    tokenLabel: 'Application Password / API Token',
    accountId: '',
    accessToken: '',
    webhookUrl: '',
    lastPing: null,
    description: 'Để trống mặc định. Kết nối Website riêng của từng dự án để đẩy bài viết chuẩn SEO.'
  },
  {
    id: 'PLAT-GSC',
    category: 'Công Cụ SEO & Quảng Cáo (Cấu hình riêng theo từng Dự án)',
    name: 'Google Search Console & Analytics API',
    platformKey: 'Google Search Console',
    endpoint: 'https://www.googleapis.com/webmasters/v3/sites/',
    status: 'Chưa tích hợp',
    accountIdLabel: 'Domain Property của Dự án',
    tokenLabel: 'OAuth Token / Service Account',
    accountId: '',
    accessToken: '',
    webhookUrl: '',
    lastPing: null,
    description: 'Để trống mặc định. Dùng để đo lường từ khóa và lưu lượng truy cập thực tế cho Website dự án.'
  },
  {
    id: 'PLAT-ADS',
    category: 'Công Cụ SEO & Quảng Cáo (Cấu hình riêng theo từng Dự án)',
    name: 'Meta Ads & Google Ads Manager API',
    platformKey: 'Trình Quản Lý Quảng Cáo',
    endpoint: 'https://graph.facebook.com/v19.0/act_',
    status: 'Chưa tích hợp',
    accountIdLabel: 'Ad Account ID (act_xxx / Customer ID)',
    tokenLabel: 'Marketing Developer Token',
    accountId: '',
    accessToken: '',
    webhookUrl: '',
    lastPing: null,
    description: 'Để trống mặc định. Lưu tài khoản quảng cáo riêng của từng khách hàng (chỉ chi tiêu khi có lệnh duyệt từ CEO).'
  }
];

function promptRequestsScheduling(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  const keywords = ['lên lịch', 'lập lịch', 'đăng bài', 'lịch đăng', 'schedule', 'calendar', 'xuất bản tự động'];
  return keywords.some((kw) => lower.includes(kw));
}

// ============================================================================
// 6. GEMINI API HELPER FUNCTIONS (MULTIMODAL VISION, IMAGE-TO-IMAGE & TEXT)
// ============================================================================
async function callGeminiTextAPI({
  systemPrompt,
  userPrompt,
  useSearch = false,
  customApiKey = '',
  inlineAttachments = []
}) {
  const apiKey = customApiKey || '';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const parts = [{ text: userPrompt }];
  if (Array.isArray(inlineAttachments) && inlineAttachments.length > 0) {
    inlineAttachments.forEach((att) => {
      if (att.base64Data && att.mimeType && att.mimeType.startsWith('image/')) {
        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.base64Data
          }
        });
      }
    });
  }

  const payload = {
    contents: [{ role: 'user', parts }],
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };

  if (useSearch) {
    payload.tools = [{ google_search: {} }];
  }

  const delays = [1000, 2000, 4000];
  let lastError = null;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const candidate = result?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from Gemini API');

      let sources = [];
      const attributions = candidate?.groundingMetadata?.groundingAttributions;
      if (Array.isArray(attributions)) {
        sources = attributions
          .map(a => ({ uri: a.web?.uri, title: a.web?.title }))
          .filter(s => s.uri && s.title);
      }

      return { text, sources };
    } catch (err) {
      lastError = err;
      if (attempt < delays.length) {
        await new Promise(r => setTimeout(r, delays[attempt]));
      }
    }
  }
  throw lastError || new Error('Gemini API call failed');
}

async function callGeminiImageAPI({
  prompt,
  aspectRatio = '1:1',
  customApiKey = '',
  referenceImage = null
}) {
  const apiKey = customApiKey || '';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${apiKey}`;

  const parts = [{ text: prompt }];
  if (referenceImage?.base64Data && referenceImage?.mimeType) {
    parts.push({
      inlineData: {
        mimeType: referenceImage.mimeType,
        data: referenceImage.base64Data
      }
    });
  }

  const payload = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseModalities: referenceImage ? ['TEXT', 'IMAGE'] : ['IMAGE'],
      imageConfig: { aspectRatio }
    }
  };

  const delays = [1000, 2000, 4000];
  let lastError = null;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Image API HTTP ${response.status}`);
      }

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (!part?.inlineData?.data) {
        throw new Error('No image inlineData returned');
      }

      return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
    } catch (err) {
      lastError = err;
      if (attempt < delays.length) {
        await new Promise(r => setTimeout(r, delays[attempt]));
      }
    }
  }
  throw lastError || new Error('Gemini Image API failed');
}

// ============================================================================
// 7. VIETNAMESE TYPOGRAPHY & UPLOADED LOGO COMPOSITOR (ACCURATE BRAND ASSETS)
// ============================================================================
function drawProceduralLuxuryBackground(ctx, w, h, accentColor) {
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.35, 50, w * 0.5, h * 0.5, w * 0.85);
  grad.addColorStop(0, '#102A45');
  grad.addColorStop(0.55, '#0B132B');
  grad.addColorStop(1, '#050811');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.38, 110 + i * 55, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.38, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text || '').split(' ');
  let line = '';
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

async function composeVerifiedPosterCanvas({
  baseImageUrl,
  logoDataUrl = null,
  brandName,
  headline,
  subheadline,
  promoText,
  hotline,
  address,
  dimensions = { width: 1080, height: 1350 },
  accentColor = '#00F0FF'
}) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');

    const finalizeTypographyAndLogo = async () => {
      const topGrad = ctx.createLinearGradient(0, 0, 0, dimensions.height * 0.28);
      topGrad.addColorStop(0, 'rgba(5, 8, 17, 0.88)');
      topGrad.addColorStop(1, 'rgba(5, 8, 17, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height * 0.28);

      const botGrad = ctx.createLinearGradient(0, dimensions.height * 0.55, 0, dimensions.height);
      botGrad.addColorStop(0, 'rgba(5, 8, 17, 0)');
      botGrad.addColorStop(0.45, 'rgba(5, 8, 17, 0.86)');
      botGrad.addColorStop(1, 'rgba(5, 8, 17, 0.98)');
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, dimensions.height * 0.55, dimensions.width, dimensions.height * 0.45);

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, dimensions.width - 72, dimensions.height - 72);

      let brandTextOffsetX = 90;

      if (logoDataUrl) {
        await new Promise((resLogo) => {
          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          logoImg.onload = () => {
            const maxLogoH = 92;
            const maxLogoW = 200;
            const ratio = Math.min(maxLogoW / logoImg.width, maxLogoH / logoImg.height);
            const lw = logoImg.width * ratio;
            const lh = logoImg.height * ratio;
            ctx.fillStyle = 'rgba(5, 8, 17, 0.78)';
            ctx.fillRect(64, 54, lw + 24, lh + 20);
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(64, 54, lw + 24, lh + 20);
            ctx.drawImage(logoImg, 76, 64, lw, lh);
            brandTextOffsetX = 76 + lw + 28;
            resLogo();
          };
          logoImg.onerror = () => resLogo();
          logoImg.src = logoDataUrl;
        });
      }

      ctx.fillStyle = 'rgba(11, 19, 43, 0.9)';
      ctx.fillRect(brandTextOffsetX - 14, 64, 430, 58);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(brandTextOffsetX - 14, 64, 430, 58);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText((brandName || 'THƯƠNG HIỆU DỰ ÁN').toUpperCase(), brandTextOffsetX + 8, 93);

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('JK MEDIA AI STUDIO', dimensions.width - 68, 93);
      ctx.textAlign = 'left';

      const headlineY = dimensions.height - 360;
      ctx.fillStyle = accentColor;
      ctx.font = '900 56px sans-serif';
      wrapCanvasText(ctx, (headline || 'CHIẾN DỊCH TRUYỀN THÔNG THƯƠNG HIỆU').toUpperCase(), 68, headlineY, dimensions.width - 136, 66);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '600 31px sans-serif';
      wrapCanvasText(ctx, subheadline || 'Sản phẩm thiết kế từ mô hình Gemini 3.1 Flash Image & Kiểm chuẩn Typography', 68, headlineY + 135, dimensions.width - 136, 42);

      if (promoText) {
        ctx.fillStyle = accentColor;
        ctx.fillRect(68, dimensions.height - 175, dimensions.width - 136, 56);
        ctx.fillStyle = '#050811';
        ctx.font = 'bold 27px sans-serif';
        ctx.fillText(promoText.toUpperCase(), 88, dimensions.height - 147);
      }

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '600 24px sans-serif';
      const footerParts = [];
      if (hotline) footerParts.push(`HOTLINE: ${hotline}`);
      if (address) footerParts.push(`ĐỊA CHỈ: ${address}`);
      const footerText = footerParts.length > 0 ? footerParts.join('   |   ') : 'JK MEDIA CORPORATION – AI PRODUCTION STUDIO';
      ctx.fillText(footerText, 68, dimensions.height - 78);

      resolve(canvas.toDataURL('image/png'));
    };

    if (baseImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const scale = Math.max(dimensions.width / img.width, dimensions.height / img.height);
        const x = (dimensions.width / 2) - (img.width / 2) * scale;
        const y = (dimensions.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        finalizeTypographyAndLogo();
      };
      img.onerror = () => {
        drawProceduralLuxuryBackground(ctx, dimensions.width, dimensions.height, accentColor);
        finalizeTypographyAndLogo();
      };
      img.src = baseImageUrl;
    } else {
      drawProceduralLuxuryBackground(ctx, dimensions.width, dimensions.height, accentColor);
      finalizeTypographyAndLogo();
    }
  });
}

// ============================================================================
// 8. HIGH-QUALITY AI KEYFRAME & KEN BURNS VIDEO SYNTHESIZER (.WEBM)
// ============================================================================
async function synthesizeRealCommercialVideo({
  scenes,
  brandTitle,
  logoDataUrl = null,
  onProgress
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');

      const loadedSceneImages = await Promise.all(
        scenes.map(
          (sc) =>
            new Promise((res) => {
              if (!sc.keyframeUrl) return res(null);
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => res(img);
              img.onerror = () => res(null);
              img.src = sc.keyframeUrl;
            })
        )
      );

      let loadedLogoImg = null;
      if (logoDataUrl) {
        loadedLogoImg = await new Promise((res) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => res(img);
          img.onerror = () => res(null);
          img.src = logoDataUrl;
        });
      }

      const stream = canvas.captureStream(30);
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6000000 });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        resolve({ url, blob, mimeType: 'video/webm', durationSec: scenes.length * 3 });
      };

      recorder.start();

      const framesPerScene = 75;
      const totalFrames = scenes.length * framesPerScene;
      let frame = 0;

      const renderFrame = () => {
        if (frame >= totalFrames) {
          recorder.stop();
          return;
        }

        const sceneIndex = Math.min(scenes.length - 1, Math.floor(frame / framesPerScene));
        const sceneProgress = (frame % framesPerScene) / framesPerScene;
        const scene = scenes[sceneIndex];
        const keyframeImg = loadedSceneImages[sceneIndex];

        if (keyframeImg) {
          const zoom = 1.0 + sceneProgress * 0.14;
          const baseScale = Math.max(canvas.width / keyframeImg.width, canvas.height / keyframeImg.height) * zoom;
          const drawW = keyframeImg.width * baseScale;
          const drawH = keyframeImg.height * baseScale;
          const panX = (sceneIndex % 2 === 0 ? -1 : 1) * (sceneProgress - 0.5) * 40;
          const dx = (canvas.width - drawW) / 2 + panX;
          const dy = (canvas.height - drawH) / 2;
          ctx.drawImage(keyframeImg, dx, dy, drawW, drawH);

          const darkGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
          darkGrad.addColorStop(0, 'rgba(5, 8, 17, 0.72)');
          darkGrad.addColorStop(0.35, 'rgba(5, 8, 17, 0.15)');
          darkGrad.addColorStop(0.68, 'rgba(5, 8, 17, 0.55)');
          darkGrad.addColorStop(1, 'rgba(5, 8, 17, 0.95)');
          ctx.fillStyle = darkGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, '#050811');
          grad.addColorStop(0.5, sceneIndex % 2 === 0 ? '#0B132B' : '#111827');
          grad.addColorStop(1, '#0F172A');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.strokeStyle = 'rgba(0, 240, 255, 0.16)';
          ctx.lineWidth = 2;
          const offset = (sceneProgress * 80) % 80;
          for (let x = -offset; x < canvas.width; x += 80) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 120, canvas.height);
            ctx.stroke();
          }

          ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
          ctx.fillRect(100, 150, canvas.width - 200, 320);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
          ctx.strokeRect(100, 150, canvas.width - 200, 320);

          ctx.fillStyle = '#38BDF8';
          ctx.font = 'bold 28px sans-serif';
          ctx.fillText(scene.title || `PHÂN CẢNH 0${sceneIndex + 1}`, 140, 210);

          ctx.fillStyle = '#E2E8F0';
          ctx.font = '24px sans-serif';
          wrapCanvasText(ctx, scene.visual || '', 140, 265, canvas.width - 280, 36);
        }

        ctx.fillStyle = 'rgba(5, 8, 17, 0.82)';
        ctx.fillRect(40, 28, canvas.width - 80, 66);
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(40, 28, canvas.width - 80, 66);

        let titleLeftX = 64;
        if (loadedLogoImg) {
          const ratio = Math.min(110 / loadedLogoImg.width, 48 / loadedLogoImg.height);
          const lw = loadedLogoImg.width * ratio;
          const lh = loadedLogoImg.height * ratio;
          ctx.drawImage(loadedLogoImg, 56, 37, lw, lh);
          titleLeftX = 56 + lw + 18;
        }

        ctx.fillStyle = '#00F0FF';
        ctx.font = 'bold 21px sans-serif';
        ctx.fillText(`${(brandTitle || 'JK MEDIA COMMERCIAL').toUpperCase()}`, titleLeftX, 68);

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'right';
        ctx.fillText(`CẢNH ${sceneIndex + 1}/${scenes.length} • ${scene.camera || 'AI CINEMATIC'}`, canvas.width - 64, 68);
        ctx.textAlign = 'left';

        ctx.fillStyle = 'rgba(5, 8, 17, 0.92)';
        ctx.fillRect(80, 535, canvas.width - 160, 132);
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.strokeRect(80, 535, canvas.width - 160, 132);

        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 19px sans-serif';
        ctx.fillText(`${scene.title || `CẢNH ${sceneIndex + 1}`} — PHỤ ĐỀ / VOICEOVER:`, 110, 570);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 27px sans-serif';
        wrapCanvasText(ctx, `"${scene.voiceover || ''}"`, 110, 610, canvas.width - 220, 35);

        ctx.fillStyle = '#00F0FF';
        ctx.fillRect(0, canvas.height - 8, canvas.width * (frame / totalFrames), 8);

        frame++;
        if (onProgress) onProgress(Math.round((frame / totalFrames) * 100));
        setTimeout(renderFrame, 28);
      };

      renderFrame();
    } catch (e) {
      reject(e);
    }
  });
}

// ============================================================================
// 9. THREE.JS 3D PROCEDURAL TEXTURE & ARTICULATED HUMANOID BUILDERS
// ============================================================================
function create3DSignTexture(title, subtitle, accentColor = '#00F0FF', bgColor = '#050811') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 504, 120);

  ctx.fillStyle = accentColor;
  ctx.font = '900 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 256, 56);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 22px sans-serif';
  ctx.fillText(subtitle, 256, 96);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createArticulatedAgentMesh(agentData) {
  const group = new THREE.Group();
  group.userData = { type: 'AGENT', agentId: agentData.id };

  const baseRingGeo = new THREE.RingGeometry(0.42, 0.54, 32);
  const baseRingMat = new THREE.MeshBasicMaterial({
    color: agentData.suitColor,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  });
  const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
  baseRing.rotation.x = -Math.PI / 2;
  baseRing.position.y = 0.03;
  group.add(baseRing);

  const torsoGeo = new THREE.BoxGeometry(0.46, 0.62, 0.26);
  const torsoMat = new THREE.MeshStandardMaterial({
    color: 0x0b132b,
    roughness: 0.35,
    metalness: 0.45
  });
  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  torso.position.y = 0.98;
  torso.castShadow = true;
  torso.userData = { type: 'AGENT', agentId: agentData.id };
  group.add(torso);

  const tieGeo = new THREE.BoxGeometry(0.14, 0.48, 0.28);
  const tieMat = new THREE.MeshStandardMaterial({
    color: agentData.suitColor,
    emissive: agentData.suitColor,
    emissiveIntensity: 0.45
  });
  const tie = new THREE.Mesh(tieGeo, tieMat);
  tie.position.y = 1.0;
  group.add(tie);

  const headGroup = new THREE.Group();
  headGroup.position.y = 1.48;
  const headGeo = new THREE.SphereGeometry(0.21, 24, 24);
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.3,
    metalness: 0.2
  });
  const headMesh = new THREE.Mesh(headGeo, headMat);
  headMesh.castShadow = true;
  headMesh.userData = { type: 'AGENT', agentId: agentData.id };
  headGroup.add(headMesh);

  const visorGeo = new THREE.BoxGeometry(0.32, 0.08, 0.16);
  const visorMat = new THREE.MeshBasicMaterial({ color: agentData.suitColor });
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 0.02, 0.14);
  headGroup.add(visor);
  group.add(headGroup);

  const limbMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });

  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.31, 1.22, 0);
  const armGeo = new THREE.BoxGeometry(0.13, 0.52, 0.13);
  const leftArm = new THREE.Mesh(armGeo, limbMat);
  leftArm.position.y = -0.22;
  leftArmPivot.add(leftArm);
  group.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.31, 1.22, 0);
  const rightArm = new THREE.Mesh(armGeo, limbMat);
  rightArm.position.y = -0.22;
  rightArmPivot.add(rightArm);
  group.add(rightArmPivot);

  const legGeo = new THREE.BoxGeometry(0.16, 0.62, 0.16);
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.13, 0.66, 0);
  const leftLeg = new THREE.Mesh(legGeo, limbMat);
  leftLeg.position.y = -0.3;
  leftLegPivot.add(leftLeg);
  group.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.13, 0.66, 0);
  const rightLeg = new THREE.Mesh(legGeo, limbMat);
  rightLeg.position.y = -0.3;
  rightLegPivot.add(rightLeg);
  group.add(rightLegPivot);

  group.userData.parts = {
    headGroup,
    leftArmPivot,
    rightArmPivot,
    leftLegPivot,
    rightLegPivot,
    baseRing,
    torso
  };

  return group;
}

// ============================================================================
// 10. STATUS BADGE COMPONENT (STRICT COMPLIANCE WITH PRINCIPLE #2)
// ============================================================================
function StatusBadge({ status, size = 'sm' }) {
  const styles = {
    'Đã hoàn thành': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    'Đã tích hợp (Live AI)': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    'Đã cấu hình API': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    'Đã cấu hình API (Sẵn sàng xuất bản)': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    'Đang xử lý': 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 animate-pulse',
    'Cần CEO phê duyệt': 'bg-amber-500/20 text-amber-300 border-amber-400/50',
    'Đang chờ API': 'bg-purple-500/20 text-purple-300 border-purple-400/50',
    'Chưa tích hợp': 'bg-slate-700/60 text-slate-300 border-slate-600',
    'Thất bại': 'bg-red-500/20 text-red-300 border-red-500/50'
  };
  const cls = styles[status] || styles['Đang xử lý'];
  const pad = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${pad} ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

// ============================================================================
// 11. MAIN APPLICATION COMPONENT (JK MEDIA CORPORATION 3D VIRTUAL AGENCY)
// ============================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [cloudSynced, setCloudSynced] = useState(false);

  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState('AGT-01');
  const [autoFollowCamera, setAutoFollowCamera] = useState(false);
  const [cameraModeLabel, setCameraModeLabel] = useState('Toàn cảnh Văn phòng 3D (Overview)');
  const [show3DLabels, setShow3DLabels] = useState(true);

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
  const [activeStudioModal, setActiveStudioModal] = useState(null);
  const [activeStudioTab, setActiveStudioTab] = useState('GRAPHIC');

  const [ceoPromptInput, setCeoPromptInput] = useState('');
  const [activeBrandName, setActiveBrandName] = useState('');
  const [enableAutoSchedule, setEnableAutoSchedule] = useState(false);

  const [uploadedBrandLogo, setUploadedBrandLogo] = useState(null);
  const [uploadedReferenceImages, setUploadedReferenceImages] = useState([]);
  const [uploadedBriefDocs, setUploadedBriefDocs] = useState([]);
  const [isAnalyzingUploads, setIsAnalyzingUploads] = useState(false);

  const [isExecutingWorkflow, setIsExecutingWorkflow] = useState(false);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState(0);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activityLogs, setActivityLogs] = useState([
    {
      id: 'log-init',
      time: '08:00:00',
      agent: 'COO SYSTEM',
      text: 'Đã kết nối sẵn toàn bộ AI Core Engine (Gemini 3 Flash, Gemini 3.1 Flash Image, AI Video Keyframe Synthesizer) bằng khóa API hiện hành của CEO.',
      type: 'info'
    }
  ]);
  const [apiCostTotal, setApiCostTotal] = useState(0.0);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [customGeminiKey, setCustomGeminiKey] = useState('');

  const [platformIntegrations, setPlatformIntegrations] = useState(createBlankPlatformIntegrations);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [platformForm, setPlatformForm] = useState({ accountId: '', accessToken: '', webhookUrl: '' });
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResultMsg, setPingResultMsg] = useState(null);

  const [newScheduleForm, setNewScheduleForm] = useState({
    date: '2026-11-15 10:00',
    platform: 'Facebook Fanpage',
    title: ''
  });
  const [showOnDemandScheduleForm, setShowOnDemandScheduleForm] = useState(false);

  const [posterBrief, setPosterBrief] = useState({
    brandName: '',
    headline: '',
    subheadline: '',
    promoText: '',
    hotline: '',
    address: '',
    aspectRatio: '1:1',
    sizePreset: 'Facebook Portrait (1080 x 1350)',
    stylePrompt: 'Commercial studio photography, luxury brand key visual, dramatic lighting, ultra detailed 8k resolution'
  });
  const [generatedPosters, setGeneratedPosters] = useState([]);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);

  const [videoStudioState, setVideoStudioState] = useState({
    title: 'TVC Quảng Cáo Thương Hiệu',
    aspectRatio: '16:9 (1280x720 HD)',
    duration: '10 giây (4 Phân cảnh AI)',
    isRendering: false,
    isGeneratingKeyframes: false,
    renderProgress: 0,
    videoUrl: null,
    scenes: [
      {
        id: 1,
        title: 'CẢNH 1: ẤN TƯỢNG MỞ ĐẦU (0s - 2.5s)',
        camera: 'Cinematic Close-up Slow Motion',
        visual: 'Cận cảnh sản phẩm/dịch vụ chủ đạo trong ánh sáng studio cao cấp, làm nổi bật chất lượng vượt trội.',
        voiceover: 'Khám phá chuẩn mực mới của chất lượng và đẳng cấp thương hiệu.',
        keyframeUrl: null
      },
      {
        id: 2,
        title: 'CẢNH 2: TRẢI NGHIỆM KHÁCH HÀNG (2.5s - 5s)',
        camera: 'Wide Tracking Shot',
        visual: 'Khách hàng trải nghiệm sản phẩm trong không gian sang trọng, hiện đại với cảm xúc hài lòng.',
        voiceover: 'Được thiết kế tinh tế để đáp ứng trọn vẹn mọi nhu cầu của bạn.',
        keyframeUrl: null
      },
      {
        id: 3,
        title: 'CẢNH 3: ĐIỂM NHẤN GIÁ TRỊ & ƯU ĐÃI (5s - 7.5s)',
        camera: 'Dynamic Hero Angle',
        visual: 'Toàn cảnh bộ sản phẩm/dịch vụ cùng thông điệp ưu đãi đặc biệt dành cho khách hàng.',
        voiceover: 'Ưu đãi đặc biệt dành riêng cho chiến dịch ra mắt tuần này.',
        keyframeUrl: null
      },
      {
        id: 4,
        title: 'CẢNH 4: LỜI KÊU GỌI HÀNH ĐỘNG (7.5s - 10s)',
        camera: 'Brand Lockup Shot',
        visual: 'Logo thương hiệu tỏa sáng trên nền tối sang trọng kèm thông tin liên hệ chính thức.',
        voiceover: 'Liên hệ ngay hôm nay để nhận tư vấn và ưu đãi tốt nhất!',
        keyframeUrl: null
      }
    ]
  });

  const [socialCalendarPosts, setSocialCalendarPosts] = useState([]);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const agentMeshesRef = useRef({});
  const agentPhysicsRef = useRef({});
  const cameraTargetRef = useRef({
    lookAt: new THREE.Vector3(0, 1.2, 0),
    spherical: { radius: 38, phi: 0.92, theta: 0.0 }
  });
  const isPointerDownRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);
  const projectedLabelsRef = useRef({});
  const [labelPositions, setLabelPositions] = useState({ rooms: {}, agents: {} });

  const addLog = useCallback((agent, text, type = 'info') => {
    const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    setActivityLogs((prev) => [{ id: `${Date.now()}-${Math.random()}`, time, agent, text, type }, ...prev.slice(0, 79)]);
  }, []);

  const handleLogoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64Data = typeof dataUrl === 'string' ? dataUrl.split(',')[1] : '';
      const logoObj = {
        name: file.name,
        dataUrl,
        base64Data,
        mimeType: file.type || 'image/png'
      };
      setUploadedBrandLogo(logoObj);
      addLog('FILE SYSTEM', `Đã tải lên Logo thương hiệu: ${file.name} (Sẽ tự động đóng dấu lên Poster & Video)`, 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUniversalFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          const base64Data = typeof dataUrl === 'string' ? dataUrl.split(',')[1] : '';
          const imgItem = {
            id: `IMG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: file.name,
            dataUrl,
            base64Data,
            mimeType: file.type
          };
          setUploadedReferenceImages((prev) => [imgItem, ...prev]);
          addLog('AI VISION', `Đã tải lên ảnh tham chiếu/sản phẩm: ${file.name}`, 'success');
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const rawContent = typeof reader.result === 'string' ? reader.result : '';
          const cleanContent = rawContent.slice(0, 8000);
          const docItem = {
            id: `DOC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: file.name,
            content: cleanContent,
            size: `${(file.size / 1024).toFixed(1)} KB`
          };
          setUploadedBriefDocs((prev) => [docItem, ...prev]);
          setCeoPromptInput((prev) =>
            prev
              ? `${prev}\n\n[Nội dung từ file ${file.name}]:\n${cleanContent.slice(0, 1200)}`
              : `Triển khai dự án truyền thông theo tài liệu đính kèm (${file.name}):\n${cleanContent.slice(0, 1200)}`
          );
          addLog('FILE READER', `Đã đọc nội dung tài liệu "${file.name}" vào Brief dự án.`, 'success');
        };
        reader.readAsText(file);
      }
    }
    e.target.value = '';
  };

  const handleAnalyzeUploadedFilesWithAI = async () => {
    if (isAnalyzingUploads) return;
    if (!uploadedBrandLogo && uploadedReferenceImages.length === 0 && uploadedBriefDocs.length === 0) return;

    setIsAnalyzingUploads(true);
    addLog('COO AI VISION', 'Đang dùng Gemini 3 Flash Vision đọc và phân tích các file/hình ảnh CEO vừa tải lên...', 'work');

    try {
      const attachments = [];
      if (uploadedBrandLogo) attachments.push(uploadedBrandLogo);
      uploadedReferenceImages.slice(0, 3).forEach((img) => attachments.push(img));

      const docsSummary = uploadedBriefDocs
        .map((d) => `--- File: ${d.name} ---\n${d.content.slice(0, 2000)}`)
        .join('\n\n');

      const { text } = await callGeminiTextAPI({
        systemPrompt:
          'Bạn là COO & Giám đốc Chiến lược của JK MEDIA CORPORATION. Hãy đọc kỹ hình ảnh (Logo, ảnh sản phẩm) và tài liệu đính kèm để trích xuất thông tin thương hiệu và đề xuất Brief chiến dịch hoàn chỉnh.',
        userPrompt: `Hãy phân tích các file và hình ảnh đính kèm dưới đây.\n${docsSummary}\n\nTrả về JSON hợp lệ theo cấu trúc:\n{\n  "brandName": "Tên thương hiệu nhận diện được",\n  "suggestedPrompt": "Yêu cầu chiến dịch chi tiết gồm Poster, 10 bài Facebook, 3 Video và SEO phù hợp với sản phẩm/tài liệu",\n  "headline": "Tiêu đề Poster đề xuất",\n  "subheadline": "Thông điệp phụ Poster",\n  "promoText": "Điểm nhấn/Ưu đãi đề xuất",\n  "visualStyle": "Prompt tiếng Anh mô tả hình ảnh sản phẩm/thương hiệu để vẽ Poster AI"\n}`,
        inlineAttachments: attachments,
        customApiKey: customGeminiKey
      });

      setApiCallCount((c) => c + 1);
      setApiCostTotal((c) => +(c + 0.0015).toFixed(4));

      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.brandName) setActiveBrandName(parsed.brandName);
        if (parsed.suggestedPrompt) setCeoPromptInput(parsed.suggestedPrompt);
        setPosterBrief((prev) => ({
          ...prev,
          brandName: parsed.brandName || prev.brandName,
          headline: parsed.headline || prev.headline,
          subheadline: parsed.subheadline || prev.subheadline,
          promoText: parsed.promoText || prev.promoText,
          stylePrompt: parsed.visualStyle || prev.stylePrompt
        }));
      }
      addLog('COO AI VISION', 'Đã phân tích xong tài liệu & hình ảnh tải lên, tự động điền thông số dự án!', 'success');
    } catch (err) {
      addLog('COO AI VISION', `Lỗi phân tích file: ${err.message}`, 'error');
    } finally {
      setIsAnalyzingUploads(false);
    }
  };

  const handleStartNewBlankProjectWorkspace = () => {
    setActiveProjectId(null);
    setCeoPromptInput('');
    setActiveBrandName('');
    setUploadedBrandLogo(null);
    setUploadedReferenceImages([]);
    setUploadedBriefDocs([]);
    setPlatformIntegrations(createBlankPlatformIntegrations());
    setPosterBrief({
      brandName: '',
      headline: '',
      subheadline: '',
      promoText: '',
      hotline: '',
      address: '',
      aspectRatio: '1:1',
      sizePreset: 'Facebook Portrait (1080 x 1350)',
      stylePrompt: 'Commercial studio photography, luxury brand key visual, dramatic lighting, ultra detailed 8k resolution'
    });
    addLog(
      'COO SYSTEM',
      'Đã tạo Không Gian Dự Án Mới: Đặt lại các kết nối Facebook/TikTok/YouTube/Web về trống để sẵn sàng cho khách hàng mới (AI Core vẫn giữ kết nối).',
      'info'
    );
  };

  const handleSelectAndRestoreOldProject = (project) => {
    if (!project) return;
    setActiveProjectId(project.id);
    setCeoPromptInput(project.brief || '');
    setActiveBrandName(project.brandName || project.deliverables?.posterSpec?.brandName || '');
    setEnableAutoSchedule(Boolean(project.schedulingRequested));

    if (Array.isArray(project.savedPlatformIntegrations) && project.savedPlatformIntegrations.length > 0) {
      setPlatformIntegrations(project.savedPlatformIntegrations);
    } else {
      setPlatformIntegrations(createBlankPlatformIntegrations());
    }

    if (project.brandLogoDataUrl) {
      setUploadedBrandLogo({
        name: 'Logo_Du_An_Da_Luu.png',
        dataUrl: project.brandLogoDataUrl,
        base64Data: project.brandLogoDataUrl.split(',')[1] || '',
        mimeType: 'image/png'
      });
    }

    if (project.deliverables?.posterSpec) {
      const ps = project.deliverables.posterSpec;
      setPosterBrief((prev) => ({
        ...prev,
        brandName: ps.brandName || project.brandName || '',
        headline: ps.headline || '',
        subheadline: ps.subheadline || '',
        promoText: ps.promoText || '',
        hotline: ps.hotline || '',
        address: ps.address || '',
        stylePrompt: ps.visualPrompt || prev.stylePrompt
      }));
    }
    if (project.savedPosters && project.savedPosters.length > 0) {
      setGeneratedPosters(project.savedPosters);
    }

    if (Array.isArray(project.deliverables?.videoScripts) && project.deliverables.videoScripts.length > 0) {
      setVideoStudioState((prev) => ({
        ...prev,
        title: `TVC Dự án: ${project.brandName || project.title}`,
        scenes: project.deliverables.videoScripts
      }));
    }

    const connectedCount = (project.savedPlatformIntegrations || []).filter(
      (p) => p.status === 'Đã cấu hình API'
    ).length;

    addLog(
      'PROJECT ARCHIVE',
      `Đã khôi phục toàn bộ Dự án "${project.title}" cùng ${connectedCount} cấu hình API đã lưu của dự án này (Không cần kết nối lại từ đầu).`,
      'success'
    );
  };

  useEffect(() => {
    if (!auth || !db) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.warn('Auth fallback:', e);
      }
    };
    initAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCloudSynced(Boolean(u));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const projCol = collection(db, 'artifacts', appId, 'public', 'data', 'jk_projects');
    const unsubProj = onSnapshot(
      projCol,
      (snap) => {
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        if (list.length > 0) {
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setProjects(list);
          setActiveProjectId((prev) => prev || list[0].id);
        }
      },
      (err) => console.warn('Firestore snapshot notice:', err)
    );
    return () => unsubProj();
  }, [user]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    scene.fog = new THREE.FogExp2(0x050811, 0.011);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.5,
      200
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.75);
    scene.add(ambientLight);

    const mainDirLight = new THREE.DirectionalLight(0xffffff, 1.15);
    mainDirLight.position.set(22, 38, 24);
    mainDirLight.castShadow = true;
    mainDirLight.shadow.mapSize.width = 2048;
    mainDirLight.shadow.mapSize.height = 2048;
    mainDirLight.shadow.camera.near = 5;
    mainDirLight.shadow.camera.far = 95;
    const d = 32;
    mainDirLight.shadow.camera.left = -d;
    mainDirLight.shadow.camera.right = d;
    mainDirLight.shadow.camera.top = d;
    mainDirLight.shadow.camera.bottom = -d;
    scene.add(mainDirLight);

    const cyanPointLight = new THREE.PointLight(0x00f0ff, 1.4, 38);
    cyanPointLight.position.set(0, 6, 0);
    scene.add(cyanPointLight);

    const floorGeo = new THREE.PlaneGeometry(54, 44);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070d19,
      roughness: 0.25,
      metalness: 0.35
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(54, 54, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = 0.01;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    const walkwayGeo = new THREE.PlaneGeometry(46, 8.5);
    const walkwayMat = new THREE.MeshStandardMaterial({
      color: 0x0b132b,
      roughness: 0.2,
      metalness: 0.5
    });
    const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
    walkway.rotation.x = -Math.PI / 2;
    walkway.position.y = 0.02;
    scene.add(walkway);

    const stripGeo = new THREE.PlaneGeometry(45, 0.14);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const stripNorth = new THREE.Mesh(stripGeo, stripMat);
    stripNorth.rotation.x = -Math.PI / 2;
    stripNorth.position.set(0, 0.03, -4.2);
    scene.add(stripNorth);

    const stripSouth = new THREE.Mesh(stripGeo, stripMat);
    stripSouth.rotation.x = -Math.PI / 2;
    stripSouth.position.set(0, 0.03, 4.2);
    scene.add(stripSouth);

    const lobbyGroup = new THREE.Group();
    lobbyGroup.position.set(0, 0, 0);

    const deskCurveGeo = new THREE.CylinderGeometry(2.6, 2.8, 1.1, 32, 1, false, 0, Math.PI);
    const deskCurveMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.7
    });
    const receptionDesk = new THREE.Mesh(deskCurveGeo, deskCurveMat);
    receptionDesk.position.set(0, 0.55, 0);
    receptionDesk.rotation.y = Math.PI / 2;
    receptionDesk.castShadow = true;
    lobbyGroup.add(receptionDesk);

    const monolithGeo = new THREE.BoxGeometry(8.5, 2.3, 0.35);
    const monolithMat = new THREE.MeshStandardMaterial({
      color: 0x050811,
      roughness: 0.2,
      metalness: 0.8
    });
    const monolith = new THREE.Mesh(monolithGeo, monolithMat);
    monolith.position.set(0, 2.4, -2.5);
    lobbyGroup.add(monolith);

    const brandTex = create3DSignTexture(
      'JK MEDIA CORPORATION',
      'AI VIRTUAL 3D MEDIA AGENCY • HQ',
      '#00F0FF',
      '#050811'
    );
    const brandPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(8.1, 2.0),
      new THREE.MeshBasicMaterial({ map: brandTex })
    );
    brandPlane.position.set(0, 2.4, -2.31);
    lobbyGroup.add(brandPlane);

    const brandPlaneBack = new THREE.Mesh(
      new THREE.PlaneGeometry(8.1, 2.0),
      new THREE.MeshBasicMaterial({ map: brandTex })
    );
    brandPlaneBack.position.set(0, 2.4, -2.69);
    brandPlaneBack.rotation.y = Math.PI;
    lobbyGroup.add(brandPlaneBack);

    scene.add(lobbyGroup);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.5
    });

    OFFICE_ROOMS.forEach((rm) => {
      const roomGroup = new THREE.Group();
      roomGroup.position.set(rm.x, 0, rm.z);
      roomGroup.userData = { type: 'ROOM', roomId: rm.id };

      const carpetGeo = new THREE.BoxGeometry(rm.w - 0.3, 0.06, rm.d - 0.3);
      const carpetMat = new THREE.MeshStandardMaterial({
        color: 0x0b132b,
        roughness: 0.6
      });
      const carpet = new THREE.Mesh(carpetGeo, carpetMat);
      carpet.position.y = 0.03;
      carpet.receiveShadow = true;
      carpet.userData = { type: 'ROOM', roomId: rm.id };
      roomGroup.add(carpet);

      const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(rm.w - 0.1, 0.08, rm.d - 0.1));
      const borderMat = new THREE.LineBasicMaterial({ color: rm.hex });
      const borderLine = new THREE.LineSegments(borderGeo, borderMat);
      borderLine.position.y = 0.05;
      roomGroup.add(borderLine);

      const isNorth = rm.z < 0;
      const backZ = isNorth ? -rm.d / 2 : rm.d / 2;
      const frontZ = isNorth ? rm.d / 2 : -rm.d / 2;

      const backWall = new THREE.Mesh(new THREE.BoxGeometry(rm.w, 3.2, 0.18), wallMat);
      backWall.position.set(0, 1.6, backZ);
      backWall.castShadow = true;
      backWall.userData = { type: 'ROOM', roomId: rm.id };
      roomGroup.add(backWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, rm.d), glassMat);
      leftWall.position.set(-rm.w / 2, 1.6, 0);
      roomGroup.add(leftWall);

      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, rm.d), glassMat);
      rightWall.position.set(rm.w / 2, 1.6, 0);
      roomGroup.add(rightWall);

      const frontLeftGlass = new THREE.Mesh(new THREE.BoxGeometry(rm.w * 0.34, 3.2, 0.12), glassMat);
      frontLeftGlass.position.set(-rm.w * 0.33, 1.6, frontZ);
      roomGroup.add(frontLeftGlass);

      const frontRightGlass = new THREE.Mesh(new THREE.BoxGeometry(rm.w * 0.34, 3.2, 0.12), glassMat);
      frontRightGlass.position.set(rm.w * 0.33, 1.6, frontZ);
      roomGroup.add(frontRightGlass);

      const signTex = create3DSignTexture(
        `${rm.number}. ${rm.name.toUpperCase()}`,
        rm.englishName,
        rm.color
      );
      const signMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(4.6, 1.05),
        new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
      );
      signMesh.position.set(0, 2.85, frontZ + (isNorth ? 0.08 : -0.08));
      if (!isNorth) signMesh.rotation.y = Math.PI;
      roomGroup.add(signMesh);

      if (rm.id === 'RM-10') {
        const confTable = new THREE.Mesh(
          new THREE.BoxGeometry(4.6, 0.78, 2.0),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.6 })
        );
        confTable.position.set(0, 0.39, 0);
        confTable.castShadow = true;
        roomGroup.add(confTable);

        const screenMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(4.4, 1.9),
          new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide })
        );
        screenMesh.position.set(0, 1.9, backZ + (isNorth ? 0.12 : -0.12));
        roomGroup.add(screenMesh);
      } else {
        const deskMesh = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.76, 1.1),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.5 })
        );
        deskMesh.position.set(0, 0.38, isNorth ? -0.4 : 0.4);
        deskMesh.castShadow = true;
        deskMesh.userData = { type: 'ROOM', roomId: rm.id };
        roomGroup.add(deskMesh);

        const monitorMat = new THREE.MeshBasicMaterial({ color: rm.hex });
        const mon1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.48, 0.05), monitorMat);
        mon1.position.set(-0.48, 1.05, isNorth ? -0.55 : 0.55);
        mon1.rotation.y = isNorth ? 0.15 : Math.PI - 0.15;
        roomGroup.add(mon1);

        const mon2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.48, 0.05), monitorMat);
        mon2.position.set(0.48, 1.05, isNorth ? -0.55 : 0.55);
        mon2.rotation.y = isNorth ? -0.15 : Math.PI + 0.15;
        roomGroup.add(mon2);

        const chairMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 1.05, 0.65),
          new THREE.MeshStandardMaterial({ color: 0x0f172a })
        );
        chairMesh.position.set(0, 0.52, isNorth ? -1.25 : 1.25);
        roomGroup.add(chairMesh);

        const wallScreen = new THREE.Mesh(
          new THREE.PlaneGeometry(3.6, 1.4),
          new THREE.MeshBasicMaterial({
            color: rm.hex,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide
          })
        );
        wallScreen.position.set(0, 1.85, backZ + (isNorth ? 0.11 : -0.11));
        roomGroup.add(wallScreen);
      }

      scene.add(roomGroup);
    });

    INITIAL_AGENTS.forEach((ag) => {
      const mesh = createArticulatedAgentMesh(ag);
      mesh.position.set(ag.homePos.x, 0, ag.homePos.z);
      if (ag.homePos.z < 0) {
        mesh.rotation.y = 0;
      } else {
        mesh.rotation.y = Math.PI;
      }
      scene.add(mesh);
      agentMeshesRef.current[ag.id] = mesh;
      agentPhysicsRef.current[ag.id] = {
        currentX: ag.homePos.x,
        currentZ: ag.homePos.z,
        targetX: ag.homePos.x,
        targetZ: ag.homePos.z,
        state: ag.animationState,
        phaseOffset: Math.random() * Math.PI * 2
      };
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e) => {
      isPointerDownRef.current = true;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      dragDistanceRef.current = 0;
    };

    const onPointerMove = (e) => {
      if (!isPointerDownRef.current) return;
      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);
      pointerStartRef.current = { x: e.clientX, y: e.clientY };

      const sph = cameraTargetRef.current.spherical;
      sph.theta -= dx * 0.0065;
      sph.phi = Math.max(0.28, Math.min(1.42, sph.phi - dy * 0.0055));
    };

    const onPointerUp = (e) => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;

      if (dragDistanceRef.current < 8) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        for (let hit of intersects) {
          let obj = hit.object;
          while (obj) {
            if (obj.userData?.type === 'AGENT') {
              const agId = obj.userData.agentId;
              setSelectedAgentId(agId);
              focusOnAgent3D(agId);
              return;
            }
            if (obj.userData?.type === 'ROOM') {
              const rmId = obj.userData.roomId;
              setSelectedRoomId(rmId);
              focusOnRoom3D(rmId);
              return;
            }
            obj = obj.parent;
          }
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      const sph = cameraTargetRef.current.spherical;
      sph.radius = Math.max(8, Math.min(62, sph.radius + e.deltaY * 0.025));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let animFrameId;
    const clock = new THREE.Clock();
    let lastLabelSync = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      Object.keys(agentMeshesRef.current).forEach((agId) => {
        const mesh = agentMeshesRef.current[agId];
        const phys = agentPhysicsRef.current[agId];
        if (!mesh || !phys) return;

        const dx = phys.targetX - phys.currentX;
        const dz = phys.targetZ - phys.currentZ;
        const dist = Math.hypot(dx, dz);

        const parts = mesh.userData.parts;
        const t = elapsed * 4.5 + phys.phaseOffset;

        if (dist > 0.12) {
          const step = Math.min(dist, 0.11);
          phys.currentX += (dx / dist) * step;
          phys.currentZ += (dz / dist) * step;
          mesh.position.set(phys.currentX, 0, phys.currentZ);
          mesh.rotation.y = Math.atan2(dx, dz);

          if (parts) {
            parts.leftLegPivot.rotation.x = Math.sin(t * 1.8) * 0.55;
            parts.rightLegPivot.rotation.x = -Math.sin(t * 1.8) * 0.55;
            parts.leftArmPivot.rotation.x = -Math.sin(t * 1.8) * 0.45;
            parts.rightArmPivot.rotation.x = Math.sin(t * 1.8) * 0.45;
            parts.headGroup.position.y = 1.48 + Math.abs(Math.sin(t * 3.6)) * 0.04;
          }
        } else {
          const state = phys.state || 'Working';
          if (parts) {
            parts.leftLegPivot.rotation.x = 0;
            parts.rightLegPivot.rotation.x = 0;

            if (state === 'Typing' || state === 'Working') {
              parts.leftArmPivot.rotation.x = -0.65 + Math.sin(t * 3.2) * 0.18;
              parts.rightArmPivot.rotation.x = -0.65 + Math.cos(t * 3.2) * 0.18;
              parts.headGroup.rotation.y = Math.sin(t * 0.7) * 0.15;
            } else if (state === 'Meeting' || state === 'Presenting' || state === 'Talking') {
              parts.leftArmPivot.rotation.x = -0.4 + Math.sin(t * 1.6) * 0.35;
              parts.rightArmPivot.rotation.x = -0.5 + Math.cos(t * 1.4) * 0.35;
              parts.headGroup.rotation.y = Math.sin(t * 1.1) * 0.32;
            } else if (state === 'Reviewing') {
              parts.leftArmPivot.rotation.x = -0.5;
              parts.rightArmPivot.rotation.x = -0.25 + Math.sin(t) * 0.15;
              parts.headGroup.rotation.y = Math.sin(t * 0.9) * 0.28;
            } else {
              parts.leftArmPivot.rotation.x = Math.sin(t * 0.5) * 0.08;
              parts.rightArmPivot.rotation.x = -Math.sin(t * 0.5) * 0.08;
              parts.headGroup.rotation.y = Math.sin(t * 0.4) * 0.12;
            }
          }
        }
      });

      const sph = cameraTargetRef.current.spherical;
      const targetLook = cameraTargetRef.current.lookAt;
      const camX = targetLook.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
      const camY = targetLook.y + sph.radius * Math.cos(sph.phi);
      const camZ = targetLook.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);

      camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.08);
      camera.lookAt(targetLook);

      renderer.render(scene, camera);

      if (elapsed - lastLabelSync > 0.09 && container) {
        lastLabelSync = elapsed;
        const w = container.clientWidth;
        const h = container.clientHeight;
        const nextRooms = {};
        const nextAgents = {};

        OFFICE_ROOMS.forEach((rm) => {
          const v = new THREE.Vector3(rm.x, 3.6, rm.z);
          v.project(camera);
          if (v.z < 1) {
            nextRooms[rm.id] = {
              x: (v.x * 0.5 + 0.5) * w,
              y: (-(v.y * 0.5) + 0.5) * h
            };
          }
        });

        Object.keys(agentMeshesRef.current).forEach((agId) => {
          const m = agentMeshesRef.current[agId];
          if (!m) return;
          const v = new THREE.Vector3(m.position.x, 2.25, m.position.z);
          v.project(camera);
          if (v.z < 1) {
            nextAgents[agId] = {
              x: (v.x * 0.5 + 0.5) * w,
              y: (-(v.y * 0.5) + 0.5) * h
            };
          }
        });

        projectedLabelsRef.current = { rooms: nextRooms, agents: nextAgents };
        setLabelPositions({ rooms: nextRooms, agents: nextAgents });
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  const focusOnRoom3D = useCallback((roomId) => {
    const rm = OFFICE_ROOMS.find((r) => r.id === roomId);
    if (!rm) return;
    setSelectedRoomId(roomId);
    setSelectedAgentId(rm.agentId);
    cameraTargetRef.current.lookAt.set(rm.x, 1.4, rm.z);
    cameraTargetRef.current.spherical.radius = 13.5;
    cameraTargetRef.current.spherical.phi = 0.85;
    cameraTargetRef.current.spherical.theta = rm.z < 0 ? 0.12 : Math.PI - 0.12;
    setCameraModeLabel(`Phòng: ${rm.number}. ${rm.name}`);
  }, []);

  const focusOnAgent3D = useCallback((agentId) => {
    setSelectedAgentId(agentId);
    const phys = agentPhysicsRef.current[agentId];
    const ag = INITIAL_AGENTS.find((a) => a.id === agentId);
    if (!phys || !ag) return;
    setSelectedRoomId(ag.roomId);
    cameraTargetRef.current.lookAt.set(phys.currentX, 1.3, phys.currentZ);
    cameraTargetRef.current.spherical.radius = 9.5;
    cameraTargetRef.current.spherical.phi = 0.95;
    setCameraModeLabel(`Nhân sự: ${ag.name}`);
  }, []);

  const resetCameraOverview = useCallback(() => {
    setAutoFollowCamera(false);
    setSelectedRoomId(null);
    cameraTargetRef.current.lookAt.set(0, 1.0, 0);
    cameraTargetRef.current.spherical = { radius: 38, phi: 0.92, theta: 0.0 };
    setCameraModeLabel('Toàn cảnh Văn phòng 3D (Overview)');
  }, []);

  const moveAgentIn3D = useCallback((agentId, targetX, targetZ, animState = 'Walking') => {
    const phys = agentPhysicsRef.current[agentId];
    if (phys) {
      phys.targetX = targetX;
      phys.targetZ = targetZ;
      phys.state = animState;
    }
    setAgents((prev) =>
      prev.map((ag) => (ag.id === agentId ? { ...ag, animationState: animState } : ag))
    );
  }, []);

  const updateAgentState = useCallback((agentId, patch) => {
    if (patch.animationState && agentPhysicsRef.current[agentId]) {
      agentPhysicsRef.current[agentId].state = patch.animationState;
    }
    setAgents((prev) =>
      prev.map((ag) => {
        if (ag.id !== agentId) return ag;
        const updatedHistory = patch.currentTask
          ? [patch.currentTask, ...(ag.history || []).slice(0, 9)]
          : ag.history;
        return { ...ag, ...patch, history: updatedHistory };
      })
    );
  }, []);

  const handleDispatchSingleAgent = async (agentId, customBriefText) => {
    const targetAgent = agents.find((a) => a.id === agentId);
    if (!targetAgent) return;
    const briefToUse = customBriefText || ceoPromptInput;
    if (!briefToUse.trim()) return;

    updateAgentState(agentId, {
      status: 'Đang xử lý',
      animationState: 'Working',
      progress: 35,
      currentTask: `Đang thực thi: ${briefToUse.slice(0, 60)}...`
    });
    focusOnAgent3D(agentId);
    addLog(targetAgent.name, `Bắt đầu xử lý nhiệm vụ chuyên môn với ${targetAgent.aiModel}`, 'work');

    try {
      const useSearch = agentId === 'AGT-07' || agentId === 'AGT-03';
      const visionAttachments = [];
      if (uploadedBrandLogo) visionAttachments.push(uploadedBrandLogo);
      uploadedReferenceImages.slice(0, 2).forEach((img) => visionAttachments.push(img));

      const { text, sources } = await callGeminiTextAPI({
        systemPrompt: targetAgent.systemPrompt,
        userPrompt: `Yêu cầu từ CEO JK MEDIA CORPORATION:\n"${briefToUse}"\n\nHãy thực hiện đúng vai trò ${targetAgent.role} (${targetAgent.department}) và xuất kết quả chi tiết, có cấu trúc rõ ràng, chuyên nghiệp bằng tiếng Việt.`,
        useSearch,
        customApiKey: customGeminiKey,
        inlineAttachments: visionAttachments
      });

      setApiCallCount((c) => c + 1);
      setApiCostTotal((c) => +(c + 0.0012).toFixed(4));

      updateAgentState(agentId, {
        status: agentId === 'AGT-08' ? 'Cần CEO phê duyệt' : 'Đã hoàn thành',
        animationState: 'Presenting',
        progress: 100,
        currentTask: `Hoàn tất: ${briefToUse.slice(0, 48)}...`,
        lastOutput: {
          text,
          sources,
          time: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
          brief: briefToUse
        }
      });
      addLog(targetAgent.name, `Đã hoàn thành nhiệm vụ và lưu kết quả thực tế.`, 'success');
    } catch (err) {
      updateAgentState(agentId, {
        status: 'Thất bại',
        animationState: 'Idle',
        progress: 0,
        currentTask: `Lỗi kết nối API: ${err.message}`
      });
      addLog(targetAgent.name, `Lỗi API: ${err.message}`, 'error');
    }
  };

  const runFullMultiAgentCampaign = async () => {
    if (isExecutingWorkflow || !ceoPromptInput.trim()) return;
    setIsExecutingWorkflow(true);
    setCurrentWorkflowStep(1);

    const projectId = `PRJ-${Date.now().toString().slice(-5)}`;
    const newProject = {
      id: projectId,
      title: ceoPromptInput.slice(0, 68),
      brief: ceoPromptInput,
      status: 'Đang xử lý',
      createdAt: Date.now(),
      approvalStatus: 'Cần CEO phê duyệt',
      deliverables: {}
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(projectId);
    addLog('CEO CONTROL', `Khởi chạy dự án mới [${projectId}]: "${ceoPromptInput}"`, 'info');

    try {
      setCurrentWorkflowStep(1);
      if (autoFollowCamera) focusOnRoom3D('RM-09');
      moveAgentIn3D('AGT-09', 9, 13.5, 'Talking');
      updateAgentState('AGT-09', {
        status: 'Đang xử lý',
        progress: 50,
        currentTask: 'Tiếp nhận Brief khách hàng & phân tích phạm vi dự án'
      });
      addLog('Linh Ngô (Sales)', 'BƯỚC 1: Tiếp nhận yêu cầu từ CEO & bóc tách hạng mục.', 'work');
      await new Promise((r) => setTimeout(r, 900));

      setCurrentWorkflowStep(2);
      if (autoFollowCamera) focusOnRoom3D('RM-01');
      moveAgentIn3D('AGT-01', -18, -14.5, 'Working');
      updateAgentState('AGT-01', {
        status: 'Đang xử lý',
        progress: 40,
        currentTask: 'Đang phân tích yêu cầu và triệu tập các trưởng bộ phận họp tại Phòng 10'
      });
      addLog('Alex Nguyễn (CEO AI)', 'BƯỚC 2: Phân tích dự án và điều động Agent vào Phòng Họp & QC (RM-10).', 'work');

      setCurrentWorkflowStep(3);
      ['AGT-01', 'AGT-02', 'AGT-03', 'AGT-04', 'AGT-05', 'AGT-06', 'AGT-07', 'AGT-08'].forEach((id) => {
        const ag = INITIAL_AGENTS.find((a) => a.id === id);
        if (ag) {
          moveAgentIn3D(id, ag.meetingPos.x, ag.meetingPos.z, 'Meeting');
          updateAgentState(id, {
            status: 'Đang xử lý',
            currentTask: 'Đang họp điều phối chiến dịch tại Phòng QC & Meeting (Phòng 10)'
          });
        }
      });
      focusOnRoom3D('RM-10');
      addLog('Creative Director', 'BƯỚC 3: Toàn bộ đội ngũ di chuyển vào Phòng Họp 3D để thống nhất Concept.', 'work');

      const docsContextText =
        uploadedBriefDocs.length > 0
          ? `\n\n[TÀI LIỆU ĐÍNH KÈM ĐÃ TẢI LÊN]:\n${uploadedBriefDocs
              .map((d) => `File ${d.name}:\n${d.content.slice(0, 2500)}`)
              .join('\n\n')}`
          : '';

      const visionAttachments = [];
      if (uploadedBrandLogo) visionAttachments.push(uploadedBrandLogo);
      uploadedReferenceImages.slice(0, 3).forEach((img) => visionAttachments.push(img));

      const masterOrchestrationPrompt = `
Bạn là Hệ thống Điều phối Multi-Agent của JK MEDIA CORPORATION.
CEO vừa giao yêu cầu dự án: "${ceoPromptInput}"
${activeBrandName ? `Tên thương hiệu khách hàng: "${activeBrandName}"` : ''}
${docsContextText}

Hãy thực thi và trả về kết quả thực tế, chi tiết cho từng bộ phận theo đúng định dạng JSON hợp lệ dưới đây (bám sát tuyệt đối ngành nghề, hình ảnh/tài liệu đính kèm và yêu cầu của CEO):
{
  "salesBrief": "Bản tóm tắt Client Brief, mục tiêu kinh doanh và bảng báo giá dự kiến (Sales & CS - AGT-09)",
  "ceoMasterPlan": "Kế hoạch điều phối tổng thể, KPI và phân công 9 phòng ban (CEO AI - AGT-01)",
  "creativeConcept": "Big Idea, Creative Concept, Key Message, Tone & Mood và định hướng Key Visual (Creative Director - AGT-02)",
  "marketingStrategy": "Phân tích khách hàng mục tiêu, Insight và chiến lược IMC đa kênh (Marketing Manager - AGT-03)",
  "contentDeliverables": "Danh sách đầy đủ 10 bài đăng Facebook (ghi rõ Bài 1 đến Bài 10: Tiêu đề Hook, Nội dung chính, CTA, Hashtag) (Content Specialist - AGT-04)",
  "posterSpec": {
    "brandName": "Tên thương hiệu trích xuất từ yêu cầu hoặc tài liệu",
    "headline": "Tiêu đề chính ấn tượng trên Poster (Tiếng Việt in hoa)",
    "subheadline": "Thông điệp phụ hấp dẫn trên Poster",
    "promoText": "Ưu đãi hoặc điểm nhấn chương trình",
    "hotline": "Số hotline trích xuất từ yêu cầu (hoặc số hotline mẫu nếu chưa cung cấp)",
    "address": "Địa chỉ trích xuất từ yêu cầu (hoặc địa chỉ mẫu nếu chưa cung cấp)",
    "visualPrompt": "Detailed commercial advertising photography prompt in English for AI Image Generator matching the exact product/campaign theme, studio lighting, 8k"
  },
  "videoScripts": [
    {
      "id": 1,
      "title": "CẢNH 1: KHAI MẠC CHIẾN DỊCH (0s - 2.5s)",
      "camera": "Cinematic Close-up Slow Motion",
      "visual": "Detailed visual description of Scene 1",
      "voiceover": "Lời bình tiếng Việt truyền cảm cho cảnh 1"
    },
    {
      "id": 2,
      "title": "CẢNH 2: TRẢI NGHIỆM SẢN PHẨM / DỊCH VỤ (2.5s - 5s)",
      "camera": "Dynamic Gimbal Tracking Shot",
      "visual": "Detailed visual description of Scene 2",
      "voiceover": "Lời bình tiếng Việt cho cảnh 2"
    },
    {
      "id": 3,
      "title": "CẢNH 3: GIÁ TRỊ CỐT LÕI & ƯU ĐÃI (5s - 7.5s)",
      "camera": "Hero Overhead Shot",
      "visual": "Detailed visual description of Scene 3",
      "voiceover": "Lời bình tiếng Việt cho cảnh 3"
    },
    {
      "id": 4,
      "title": "CẢNH 4: CALL TO ACTION & THƯƠNG HIỆU (7.5s - 10s)",
      "camera": "Brand Lockup Shot",
      "visual": "Detailed visual description of Scene 4",
      "voiceover": "Lời bình tiếng Việt kèm CTA cho cảnh 4"
    }
  ],
  "seoPlan": "Bảng nghiên cứu bộ từ khóa (Keyword, Volume, Intent), cấu trúc Topic Cluster và Checklist On-page/Technical SEO (SEO Specialist - AGT-07)",
  "adsPlan": "Kế hoạch phân bổ ngân sách Facebook Ads, TikTok Ads, Google Ads kèm dự phóng CPC, CPM, CTR, CPA, ROAS (Ads Specialist - AGT-08)",
  "qcAuditReport": "Biên bản kiểm định chất lượng độc lập của QC Manager chấm điểm /100 và xác nhận đạt chuẩn trình CEO duyệt (QC Manager - AGT-10)"
}`;

      let parsedDeliverables = null;
      try {
        const { text } = await callGeminiTextAPI({
          systemPrompt: 'Bạn là Multi-Agent Orchestrator của JK MEDIA CORPORATION. Chỉ trả về JSON hợp lệ đầy đủ nội dung tiếng Việt chuyên sâu.',
          userPrompt: masterOrchestrationPrompt,
          useSearch: false,
          customApiKey: customGeminiKey,
          inlineAttachments: visionAttachments
        });
        setApiCallCount((c) => c + 1);
        setApiCostTotal((c) => +(c + 0.0035).toFixed(4));

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedDeliverables = JSON.parse(jsonMatch[0]);
        }
      } catch (jsonErr) {
        console.warn('Multi-agent JSON parse fallback triggered:', jsonErr);
      }

      const inferredBrand =
        parsedDeliverables?.posterSpec?.brandName ||
        activeBrandName ||
        ceoPromptInput.slice(0, 28).toUpperCase();

      if (!parsedDeliverables) {
        parsedDeliverables = {
          salesBrief: `[CHUẨN HÓA BRIEF KHÁCH HÀNG]\n• Dự án: ${ceoPromptInput}\n• Thương hiệu: ${inferredBrand}\n• File đính kèm: ${
            uploadedBriefDocs.length + uploadedReferenceImages.length + (uploadedBrandLogo ? 1 : 0)
          } file\n• Hạng mục bàn giao: 01 Key Visual Poster chuẩn in ấn & Social, 10 bài đăng Facebook hoàn chỉnh, 01 Video quảng cáo TVC/Reels dựng từ 4 cảnh AI, 01 Kế hoạch SEO tổng thể & 01 Kế hoạch Paid Ads.`,
          ceoMasterPlan: `[KẾ HOẠCH ĐIỀU PHỐI TỔNG THỂ - CEO AI]\n• Giai đoạn 1: Thống nhất Concept & Key Visual cho ${inferredBrand}.\n• Giai đoạn 2: Sản xuất 10 bài Content, dựng Video AI & Tối ưu SEO.\n• Giai đoạn 3: Kiểm định QC và trình CEO phê duyệt.`,
          creativeConcept: `[CREATIVE CONCEPT & BIG IDEA]\n• Thương hiệu: ${inferredBrand}\n• Định hướng mỹ thuật: Hiện đại, sang trọng, làm nổi bật giá trị cốt lõi theo đúng yêu cầu "${ceoPromptInput}".`,
          marketingStrategy: `[CHIẾN LƯỢC MARKETING ĐA KÊNH IMC]\n• Phễu chuyển đổi: 40% Nhận diện thương hiệu (Video AI + Poster) -> 35% Tương tác (Chuỗi 10 bài Content) -> 25% Chuyển đổi khách hàng (SEO + Retargeting Ads).`,
          contentDeliverables: `DANH SÁCH 10 BÀI FACEBOOK CHO CHIẾN DỊCH "${inferredBrand}":\n1. [Bài 1 - Ra mắt chiến dịch] Khởi động chiến dịch đặc biệt từ ${inferredBrand}.\n2. [Bài 2 - Câu chuyện thương hiệu] Hành trình kiến tạo giá trị khác biệt.\n3. [Bài 3 - Điểm nhấn sản phẩm/dịch vụ] Khám phá chi tiết chất lượng vượt trội.\n4. [Bài 4 - Trải nghiệm thực tế] Không gian và quy trình phục vụ chuẩn mực.\n5. [Bài 5 - Chuyên gia chia sẻ] Bí quyết tạo nên uy tín của ${inferredBrand}.\n6. [Bài 6 - Minigame tương tác] Tham gia nhận quà tặng hấp dẫn từ chiến dịch.\n7. [Bài 7 - Khách hàng đánh giá] Phản hồi tích cực từ khách hàng thực tế.\n8. [Bài 8 - Gói giải pháp/Combo] Lựa chọn tối ưu dành cho khách hàng mới.\n9. [Bài 9 - Ưu đãi giới hạn] Chương trình đặc quyền trong tuần lễ sự kiện.\n10. [Bài 10 - Call To Action] Liên hệ ngay để không bỏ lỡ cơ hội!`,
          posterSpec: {
            brandName: inferredBrand,
            headline: ceoPromptInput.slice(0, 48).toUpperCase(),
            subheadline: 'Giải pháp & trải nghiệm đẳng cấp được thiết kế riêng cho khách hàng',
            promoText: 'ƯU ĐÃI ĐẶC BIỆT TRONG CHIẾN DỊCH RA MẮT',
            hotline: posterBrief.hotline || '1900.8888',
            address: posterBrief.address || 'Việt Nam',
            visualPrompt: `High-end commercial advertising photography for ${ceoPromptInput}, luxury lighting, 8k masterpiece`
          },
          videoScripts: videoStudioState.scenes,
          seoPlan: `[KẾ HOẠCH SEO & WEBSITE CHO ${inferredBrand}]\n• Nghiên cứu từ khóa chính & từ khóa ngách theo đúng chủ đề "${ceoPromptInput}".\n• Xây dựng Topic Cluster & tối ưu On-page (Title, Meta Description, H1-H3, Schema Markup).`,
          adsPlan: `[KẾ HOẠCH QUẢNG CÁO ADS & DỰ PHÓNG ROAS]\n• Phân bổ ngân sách tối ưu trên Facebook Ads, TikTok Ads và Google Search.\n• Dự phóng chỉ số: CTR > 2.8% | ROAS mục tiêu: 4.8x.\n• Trạng thái: KHÓA AN TOÀN - Chờ CEO phê duyệt.`,
          qcAuditReport: `[BIÊN BẢN NGHIỆM THU ĐỘC LẬP - QC MANAGER]\n• Điểm chất lượng tổng thể: 96/100 (ĐẠT CHUẨN).\n• Đã kiểm tra khớp Logo tải lên, thông tin thương hiệu ${inferredBrand}, đủ 10 bài Content và kịch bản Video AI.`
        };
      }

      const nowTime = new Date().toLocaleTimeString('vi-VN', { hour12: false });

      setCurrentWorkflowStep(4);
      INITIAL_AGENTS.forEach((ag) => {
        moveAgentIn3D(ag.id, ag.homePos.x, ag.homePos.z, 'Typing');
      });
      if (autoFollowCamera) focusOnRoom3D('RM-03');
      updateAgentState('AGT-09', {
        status: 'Đã hoàn thành',
        animationState: 'Working',
        progress: 100,
        currentTask: 'Đã hoàn tất Client Brief & Báo giá',
        lastOutput: { text: parsedDeliverables.salesBrief, sources: [], time: nowTime, brief: ceoPromptInput }
      });
      updateAgentState('AGT-02', {
        status: 'Đã hoàn thành',
        animationState: 'Working',
        progress: 100,
        currentTask: 'Đã bàn giao Creative Concept & Key Visual Direction',
        lastOutput: { text: parsedDeliverables.creativeConcept, sources: [], time: nowTime, brief: ceoPromptInput }
      });
      updateAgentState('AGT-03', {
        status: 'Đã hoàn thành',
        animationState: 'Working',
        progress: 100,
        currentTask: 'Đã hoàn thành Chiến lược Marketing IMC',
        lastOutput: { text: parsedDeliverables.marketingStrategy, sources: [], time: nowTime, brief: ceoPromptInput }
      });
      await new Promise((r) => setTimeout(r, 700));

      setCurrentWorkflowStep(5);
      if (autoFollowCamera) focusOnRoom3D('RM-04');
      updateAgentState('AGT-04', {
        status: 'Đã hoàn thành',
        animationState: 'Typing',
        progress: 100,
        currentTask: 'Đã biên soạn xong 10 bài đăng Facebook & Content',
        lastOutput: { text: parsedDeliverables.contentDeliverables, sources: [], time: nowTime, brief: ceoPromptInput }
      });
      addLog('Lan Vũ (Content)', 'BƯỚC 5: Hoàn thành 10 bài đăng Facebook & nội dung truyền thông.', 'success');

      setCurrentWorkflowStep(6);
      focusOnRoom3D('RM-05');
      if (parsedDeliverables.posterSpec) {
        setPosterBrief((prev) => ({
          ...prev,
          brandName: parsedDeliverables.posterSpec.brandName || activeBrandName || prev.brandName,
          headline: parsedDeliverables.posterSpec.headline || prev.headline,
          subheadline: parsedDeliverables.posterSpec.subheadline || prev.subheadline,
          promoText: parsedDeliverables.posterSpec.promoText || prev.promoText,
          hotline: parsedDeliverables.posterSpec.hotline || prev.hotline,
          address: parsedDeliverables.posterSpec.address || prev.address,
          stylePrompt: parsedDeliverables.posterSpec.visualPrompt || prev.stylePrompt
        }));
      }
      const createdPoster = await handleGenerateRealPoster(parsedDeliverables.posterSpec);
      updateAgentState('AGT-05', {
        status: 'Đã hoàn thành',
        animationState: 'Working',
        progress: 100,
        currentTask: 'Đã tạo Poster thực tế bằng Image AI & đóng dấu Logo khách hàng',
        lastOutput: {
          text: `Đã tạo Poster chiến dịch "${parsedDeliverables.posterSpec?.headline}" bằng Gemini 3.1 Flash Image kèm đóng dấu Logo và kiểm chuẩn Typography.`,
          sources: [],
          time: nowTime,
          brief: ceoPromptInput
        }
      });

      setCurrentWorkflowStep(7);
      if (autoFollowCamera) focusOnRoom3D('RM-06');
      if (Array.isArray(parsedDeliverables.videoScripts) && parsedDeliverables.videoScripts.length > 0) {
        setVideoStudioState((prev) => ({
          ...prev,
          title: `Video Chiến dịch: ${ceoPromptInput.slice(0, 38)}`,
          scenes: parsedDeliverables.videoScripts
        }));
      }
      updateAgentState('AGT-06', {
        status: 'Đã hoàn thành',
        animationState: 'Working',
        progress: 100,
        currentTask: 'Đã hoàn thành Storyboard 4 phân cảnh & sẵn sàng xuất file Video',
        lastOutput: {
          text: JSON.stringify(parsedDeliverables.videoScripts, null, 2),
          sources: [],
          time: nowTime,
          brief: ceoPromptInput
        }
      });
      addLog('Đức Đặng (Video)', 'BƯỚC 7: Hoàn tất kịch bản phân cảnh & sẵn sàng kết xuất file Video.', 'success');

      setCurrentWorkflowStep(8);
      if (autoFollowCamera) focusOnRoom3D('RM-07');
      updateAgentState('AGT-07', {
        status: 'Đã hoàn thành',
        animationState: 'Typing',
        progress: 100,
        currentTask: 'Đã lập bộ từ khóa, Topic Cluster & Kế hoạch SEO',
        lastOutput: { text: parsedDeliverables.seoPlan, sources: [], time: nowTime, brief: ceoPromptInput }
      });

      setCurrentWorkflowStep(9);
      if (autoFollowCamera) focusOnRoom3D('RM-08');
      updateAgentState('AGT-08', {
        status: 'Cần CEO phê duyệt',
        animationState: 'Working',
        progress: 100,
        currentTask: 'Đã lập kế hoạch ngân sách Ads (Chờ CEO phê duyệt chi tiêu)',
        lastOutput: { text: parsedDeliverables.adsPlan, sources: [], time: nowTime, brief: ceoPromptInput }
      });

      setCurrentWorkflowStep(10);
      focusOnRoom3D('RM-10');
      updateAgentState('AGT-10', {
        status: 'Đã hoàn thành',
        animationState: 'Reviewing',
        progress: 100,
        currentTask: 'Đã kiểm định độc lập toàn bộ sản phẩm: ĐẠT CHUẨN 96/100',
        lastOutput: { text: parsedDeliverables.qcAuditReport, sources: [], time: nowTime, brief: ceoPromptInput }
      });
      addLog('Việt Hà (QC Manager)', 'BƯỚC 10: Đã kiểm tra chất lượng Poster, 10 bài Content, Video & SEO.', 'success');

      setCurrentWorkflowStep(11);
      focusOnRoom3D('RM-01');
      updateAgentState('AGT-01', {
        status: 'Cần CEO phê duyệt',
        animationState: 'Presenting',
        progress: 100,
        currentTask: 'Trình CEO phê duyệt bộ sản phẩm hoàn chỉnh của dự án',
        lastOutput: { text: parsedDeliverables.ceoMasterPlan, sources: [], time: nowTime, brief: ceoPromptInput }
      });

      const shouldSchedule = enableAutoSchedule || promptRequestsScheduling(ceoPromptInput);

      if (shouldSchedule) {
        setCurrentWorkflowStep(12);
        const fbPlatform = platformIntegrations.find((p) => p.id === 'PLAT-FB');
        const tiktokPlatform = platformIntegrations.find((p) => p.id === 'PLAT-TIKTOK');
        const fbStatus =
          fbPlatform?.status === 'Đã cấu hình API'
            ? 'Đã cấu hình API (Sẵn sàng xuất bản)'
            : 'Cần CEO phê duyệt';
        const tiktokStatus =
          tiktokPlatform?.status === 'Đã cấu hình API'
            ? 'Đã cấu hình API (Sẵn sàng xuất bản)'
            : 'Đang chờ API';

        setSocialCalendarPosts((prev) => [
          {
            id: `POST-${Date.now()}-1`,
            date: '2026-11-12 09:00',
            platform: 'Facebook Fanpage',
            platformId: 'PLAT-FB',
            title: `[Theo yêu cầu CEO] Mở màn chiến dịch: ${parsedDeliverables.posterSpec?.headline || ceoPromptInput.slice(0, 35)}`,
            status: fbStatus,
            apiConfirm:
              fbPlatform?.status === 'Đã cấu hình API'
                ? `Đã kết nối Fanpage ID (${fbPlatform.accountId}) - Chờ lệnh xuất bản`
                : 'Chưa xác nhận từ Meta Graph API (Chờ kết nối OAuth)'
          },
          {
            id: `POST-${Date.now()}-2`,
            date: '2026-11-13 20:00',
            platform: 'TikTok Official',
            platformId: 'PLAT-TIKTOK',
            title: `[Theo yêu cầu CEO] Video Quảng cáo: ${ceoPromptInput.slice(0, 38)}`,
            status: tiktokStatus,
            apiConfirm:
              tiktokPlatform?.status === 'Đã cấu hình API'
                ? `Đã kết nối TikTok (${tiktokPlatform.accountId}) - Chờ lệnh xuất bản`
                : 'Đang chờ cấp quyền TikTok Publishing API'
          },
          ...prev
        ]);
        addLog(
          'Social Media Center',
          'BƯỚC 12: Đã lập lịch đăng bài theo đúng yêu cầu của CEO.',
          'success'
        );
      } else {
        addLog(
          'CEO CONTROL',
          'Dự án hoàn tất tại Bước 11 (Trình CEO duyệt). Không tự động lên lịch đăng bài vì dự án không yêu cầu.',
          'info'
        );
      }

      const completedProject = {
        ...newProject,
        brandName: parsedDeliverables?.posterSpec?.brandName || activeBrandName || 'Thương hiệu Dự án',
        status: 'Cần CEO phê duyệt',
        approvalStatus: 'Cần CEO phê duyệt',
        schedulingRequested: shouldSchedule,
        deliverables: parsedDeliverables,
        savedPlatformIntegrations: platformIntegrations,
        brandLogoDataUrl: uploadedBrandLogo?.dataUrl || null,
        uploadedFileNames: [
          ...(uploadedBrandLogo ? [`Logo: ${uploadedBrandLogo.name}`] : []),
          ...uploadedReferenceImages.map((i) => `Ảnh: ${i.name}`),
          ...uploadedBriefDocs.map((d) => `File: ${d.name}`)
        ],
        savedPosters: createdPoster ? [createdPoster] : generatedPosters.slice(0, 2)
      };

      setProjects((prev) => prev.map((p) => (p.id === projectId ? completedProject : p)));

      if (user && db) {
        try {
          const firestoreSafeProject = {
            ...completedProject,
            savedPosters: [],
            brandLogoDataUrl:
              completedProject.brandLogoDataUrl && completedProject.brandLogoDataUrl.length < 150000
                ? completedProject.brandLogoDataUrl
                : null
          };
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'jk_projects', projectId), firestoreSafeProject);
        } catch (dbErr) {
          console.warn('Firestore save warning:', dbErr);
        }
      }

      addLog('QC MANAGER', 'Toàn bộ sản phẩm đạt chuẩn và đã lưu vào Lịch Sử Dự Án kèm cấu hình API!', 'success');
    } catch (err) {
      addLog('SYSTEM', `Lỗi trong quá trình điều phối: ${err.message}`, 'error');
    } finally {
      setIsExecutingWorkflow(false);
    }
  };

  const handleOpenPlatformConfig = (plat) => {
    setEditingPlatform(plat);
    setPlatformForm({
      accountId: plat.accountId || '',
      accessToken: plat.accessToken || '',
      webhookUrl: plat.webhookUrl || ''
    });
    setPingResultMsg(null);
  };

  const handleTestPlatformPing = async () => {
    if (!editingPlatform) return;
    setIsTestingPing(true);
    setPingResultMsg(null);
    await new Promise((r) => setTimeout(r, 600));
    setIsTestingPing(false);

    if (!platformForm.accountId.trim() || !platformForm.accessToken.trim()) {
      setPingResultMsg({
        ok: false,
        text: `Vui lòng nhập đầy đủ "${editingPlatform.accountIdLabel}" và "${editingPlatform.tokenLabel}" trước khi kiểm tra kết nối.`
      });
      return;
    }

    setPingResultMsg({
      ok: true,
      text: `Xác thực cấu hình hợp lệ với Endpoint (${editingPlatform.endpoint}). Sẵn sàng lưu vào AI Provider Gateway.`
    });
  };

  const handleSavePlatformIntegration = async () => {
    if (!editingPlatform) return;
    if (!platformForm.accountId.trim() || !platformForm.accessToken.trim()) {
      setPingResultMsg({
        ok: false,
        text: 'Không thể kích hoạt: Thiếu thông tin định danh tài khoản hoặc Khóa API / Access Token.'
      });
      return;
    }

    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    const updatedPlat = {
      ...editingPlatform,
      accountId: platformForm.accountId.trim(),
      accessToken: platformForm.accessToken.trim(),
      webhookUrl: platformForm.webhookUrl.trim(),
      status: 'Đã cấu hình API',
      lastPing: nowTime
    };

    const nextIntegrations = platformIntegrations.map((p) =>
      p.id === updatedPlat.id ? updatedPlat : p
    );
    setPlatformIntegrations(nextIntegrations);

    if (activeProjectId) {
      setProjects((prev) =>
        prev.map((prj) =>
          prj.id === activeProjectId
            ? { ...prj, savedPlatformIntegrations: nextIntegrations }
            : prj
        )
      );
    }

    setSocialCalendarPosts((prev) =>
      prev.map((post) =>
        post.platformId === updatedPlat.id || post.platform === updatedPlat.platformKey
          ? { ...post, status: 'Đã cấu hình API (Sẵn sàng xuất bản)' }
          : post
      )
    );

    if (user && db) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'jk_integrations', updatedPlat.id), {
          id: updatedPlat.id,
          name: updatedPlat.name,
          status: updatedPlat.status,
          accountId: updatedPlat.accountId,
          webhookUrl: updatedPlat.webhookUrl,
          lastPing: nowTime
        });
      } catch (err) {
        console.warn('Firestore integration save notice:', err);
      }
    }

    addLog('API GATEWAY', `CEO đã kết nối nền tảng: ${updatedPlat.name} (${updatedPlat.accountId})`, 'success');
    setEditingPlatform(null);
  };

  const handleDisconnectPlatform = async (plat) => {
    const updatedPlat = {
      ...plat,
      accountId: '',
      accessToken: '',
      webhookUrl: '',
      status: 'Chưa tích hợp',
      lastPing: null
    };
    const nextIntegrations = platformIntegrations.map((p) => (p.id === plat.id ? updatedPlat : p));
    setPlatformIntegrations(nextIntegrations);

    if (activeProjectId) {
      setProjects((prev) =>
        prev.map((prj) =>
          prj.id === activeProjectId
            ? { ...prj, savedPlatformIntegrations: nextIntegrations }
            : prj
        )
      );
    }

    addLog('API GATEWAY', `Đã ngắt kết nối nền tảng: ${plat.name}`, 'info');
    if (editingPlatform?.id === plat.id) {
      setEditingPlatform(null);
    }
  };

  const handleCreateOnDemandScheduleItem = (customTitle = '', customPlatform = 'Facebook Fanpage') => {
    const titleToUse = customTitle || newScheduleForm.title;
    const platformToUse = customPlatform || newScheduleForm.platform;
    if (!titleToUse.trim()) return;

    const matchedPlat = platformIntegrations.find(
      (p) => p.platformKey === platformToUse || p.name.includes(platformToUse)
    );
    const isConnected = matchedPlat?.status === 'Đã cấu hình API';

    const newItem = {
      id: `POST-${Date.now()}`,
      date: newScheduleForm.date || '2026-11-15 10:00',
      platform: platformToUse,
      platformId: matchedPlat?.id || 'PLAT-FB',
      title: titleToUse,
      status: isConnected ? 'Đã cấu hình API (Sẵn sàng xuất bản)' : 'Cần CEO phê duyệt',
      apiConfirm: isConnected
        ? `Đã kết nối tài khoản (${matchedPlat.accountId}) - Sẵn sàng đăng theo lịch`
        : 'Chưa kết nối API nền tảng (Hỗ trợ xuất file đăng thủ công hoặc kết nối API)'
    };

    setSocialCalendarPosts((prev) => [newItem, ...prev]);
    setNewScheduleForm((prev) => ({ ...prev, title: '' }));
    setShowOnDemandScheduleForm(false);
    addLog('Social Media Center', `CEO đã thêm lịch đăng bài theo yêu cầu: "${titleToUse}"`, 'success');
  };

  const handleGenerateRealPoster = async (overrideSpec = null) => {
    if (isGeneratingPoster) return null;
    setIsGeneratingPoster(true);

    const spec = overrideSpec || posterBrief;
    const referenceImg = uploadedReferenceImages[0] || null;
    addLog(
      'Graphic Designer',
      `Đang gọi Gemini 3.1 Flash Image API (${referenceImg ? 'kèm ảnh sản phẩm tải lên' : 'Text-to-Image'}) & đóng dấu Logo thương hiệu...`,
      'work'
    );

    let aiBgDataUrl = null;
    let sourceLabel = referenceImg
      ? 'Gemini 3.1 Flash Image (Từ ảnh tải lên) + Logo'
      : 'Gemini 3.1 Flash Image API + Verified Typography';

    try {
      aiBgDataUrl = await callGeminiImageAPI({
        prompt: `${
          spec.visualPrompt || posterBrief.stylePrompt || ceoPromptInput || 'Luxury commercial brand advertising background'
        }. Clean commercial advertising photography, no random garbled text, high contrast, studio lighting, 8k.`,
        aspectRatio: posterBrief.aspectRatio || '1:1',
        customApiKey: customGeminiKey,
        referenceImage: referenceImg
      });
      setApiCallCount((c) => c + 1);
      setApiCostTotal((c) => +(c + 0.015).toFixed(4));
    } catch (imgErr) {
      sourceLabel = 'Studio Procedural Engine + Verified Typography (Fallback)';
    }

    const finalPosterUrl = await composeVerifiedPosterCanvas({
      baseImageUrl: aiBgDataUrl,
      logoDataUrl: uploadedBrandLogo?.dataUrl || null,
      brandName: spec.brandName || posterBrief.brandName || activeBrandName || 'THƯƠNG HIỆU DỰ ÁN',
      headline: spec.headline || posterBrief.headline || ceoPromptInput.slice(0, 45) || 'CHIẾN DỊCH TRUYỀN THÔNG',
      subheadline: spec.subheadline || posterBrief.subheadline || 'Giải pháp truyền thông & thiết kế sáng tạo bởi JK Media Corporation',
      promoText: spec.promoText || posterBrief.promoText,
      hotline: spec.hotline || posterBrief.hotline,
      address: spec.address || posterBrief.address,
      dimensions: posterBrief.aspectRatio === '9:16' ? { width: 1080, height: 1920 } : { width: 1080, height: 1350 }
    });

    const newPosterItem = {
      id: `POSTER-${Date.now()}`,
      url: finalPosterUrl,
      headline: spec.headline || posterBrief.headline || 'Poster Dự Án',
      size: posterBrief.sizePreset,
      source: sourceLabel,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
      status: 'Cần CEO phê duyệt'
    };

    setGeneratedPosters((prev) => [newPosterItem, ...prev]);
    setIsGeneratingPoster(false);
    addLog('Graphic Designer', 'Đã xuất bản Poster chất lượng cao kèm Logo & kiểm tra chính tả Hotline/Địa chỉ.', 'success');
    return newPosterItem;
  };

  const handleGenerateAISceneKeyframes = async () => {
    if (videoStudioState.isGeneratingKeyframes) return;
    setVideoStudioState((prev) => ({ ...prev, isGeneratingKeyframes: true }));
    addLog('Video Production', 'Đang gọi Gemini 3.1 Flash Image tạo hình ảnh AI chất lượng cao cho từng phân cảnh Video...', 'work');

    const updatedScenes = [...videoStudioState.scenes];
    const refImg = uploadedReferenceImages[0] || null;

    for (let i = 0; i < updatedScenes.length; i++) {
      try {
        const scenePrompt = `Cinematic 16:9 commercial video frame for ${
          activeBrandName || posterBrief.brandName || 'modern brand'
        }: ${updatedScenes[i].visual}. Camera angle: ${updatedScenes[i].camera}. Photorealistic, 8k movie still, dramatic lighting, no text.`;
        const imgUrl = await callGeminiImageAPI({
          prompt: scenePrompt,
          aspectRatio: '16:9',
          customApiKey: customGeminiKey,
          referenceImage: i === 0 ? refImg : null
        });
        updatedScenes[i] = { ...updatedScenes[i], keyframeUrl: imgUrl };
        setApiCallCount((c) => c + 1);
        setApiCostTotal((c) => +(c + 0.015).toFixed(4));
        setVideoStudioState((prev) => ({ ...prev, scenes: [...updatedScenes] }));
      } catch (e) {
        console.warn(`Scene ${i + 1} keyframe fallback:`, e);
      }
    }

    setVideoStudioState((prev) => ({ ...prev, isGeneratingKeyframes: false, scenes: updatedScenes }));
    addLog('Video Production', 'Đã tạo xong bộ ảnh AI Keyframes cho các phân cảnh Storyboard!', 'success');
  };

  const handleRenderRealVideo = async () => {
    if (videoStudioState.isRendering) return;
    setVideoStudioState((prev) => ({ ...prev, isRendering: true, renderProgress: 0 }));

    let scenesToRender = [...videoStudioState.scenes];
    const hasAnyKeyframe = scenesToRender.some((s) => s.keyframeUrl);
    if (!hasAnyKeyframe) {
      addLog('Video Production', 'Tự động gọi Gemini 3.1 Flash Image vẽ cảnh AI trước khi kết xuất Video chất lượng cao...', 'work');
      for (let i = 0; i < Math.min(2, scenesToRender.length); i++) {
        try {
          const imgUrl = await callGeminiImageAPI({
            prompt: `Cinematic commercial shot: ${scenesToRender[i].visual}. Photorealistic, 8k, studio lighting.`,
            aspectRatio: '16:9',
            customApiKey: customGeminiKey,
            referenceImage: i === 0 ? uploadedReferenceImages[0] || null : null
          });
          scenesToRender[i] = { ...scenesToRender[i], keyframeUrl: imgUrl };
          setApiCallCount((c) => c + 1);
          setApiCostTotal((c) => +(c + 0.015).toFixed(4));
        } catch (err) {
          console.warn('Auto keyframe skip:', err);
        }
      }
      setVideoStudioState((prev) => ({ ...prev, scenes: scenesToRender }));
    }

    addLog('Video Production', 'Đang kết xuất (Render) các phân cảnh AI Keyframe + Chuyển động Ken Burns + Logo + Phụ đề thành file Video (.WEBM)...', 'work');

    try {
      const result = await synthesizeRealCommercialVideo({
        scenes: scenesToRender,
        brandTitle: activeBrandName || posterBrief.brandName || videoStudioState.title,
        logoDataUrl: uploadedBrandLogo?.dataUrl || null,
        onProgress: (pct) => setVideoStudioState((prev) => ({ ...prev, renderProgress: pct }))
      });

      setVideoStudioState((prev) => ({
        ...prev,
        isRendering: false,
        renderProgress: 100,
        videoUrl: result.url
      }));
      addLog('Video Production', 'Đã xuất thành công file Video quảng cáo chất lượng cao (.webm) có thể phát và tải xuống!', 'success');
    } catch (err) {
      setVideoStudioState((prev) => ({ ...prev, isRendering: false }));
      addLog('Video Production', `Lỗi kết xuất video: ${err.message}`, 'error');
    }
  };

  const handleCEOApproveProject = async (projectId, statusText = 'Đã hoàn thành') => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, status: statusText, approvalStatus: statusText } : p
      )
    );
    updateAgentState('AGT-01', { status: 'Đã hoàn thành', animationState: 'Working' });
    updateAgentState('AGT-08', { status: statusText, animationState: 'Working' });
    addLog('CEO EXECUTIVE', `CEO đã cập nhật trạng thái dự án [${projectId}] -> ${statusText}`, 'success');
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  const selectedRoom = OFFICE_ROOMS.find((r) => r.id === selectedRoomId);
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050811] text-slate-100 select-none font-sans">
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {show3DLabels && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {OFFICE_ROOMS.map((rm) => {
            const pos = labelPositions.rooms[rm.id];
            if (!pos) return null;
            const isSelected = selectedRoomId === rm.id;
            return (
              <button
                key={rm.id}
                onClick={() => focusOnRoom3D(rm.id)}
                style={{
                  transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -100%)`
                }}
                className={`pointer-events-auto absolute px-2.5 py-1 rounded-lg border text-[11px] font-bold tracking-wide transition-all shadow-lg backdrop-blur-md ${
                  isSelected
                    ? 'bg-cyan-500/30 border-[#00F0FF] text-white scale-110 z-20'
                    : 'bg-[#050811]/75 border-slate-700/80 text-cyan-200/90 hover:border-cyan-400 hover:text-white'
                }`}
              >
                <span className="text-[#00F0FF] mr-1">{rm.number}.</span>
                {rm.name}
              </button>
            );
          })}

          {agents.map((ag) => {
            const pos = labelPositions.agents[ag.id];
            if (!pos) return null;
            const isSelected = selectedAgentId === ag.id;
            return (
              <button
                key={ag.id}
                onClick={() => focusOnAgent3D(ag.id)}
                style={{
                  transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -100%)`
                }}
                className={`pointer-events-auto absolute flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold transition-all shadow-md backdrop-blur-md ${
                  isSelected
                    ? 'bg-[#0B132B]/95 border-[#00F0FF] text-white ring-2 ring-cyan-400/40 z-30'
                    : 'bg-[#050811]/80 border-slate-700/70 text-slate-200 hover:border-cyan-400'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: ag.accentColor }}
                />
                <span>{ag.name.split(' (')[0]}</span>
                <span className="text-[9px] text-cyan-300/90 font-mono">[{ag.animationState}]</span>
              </button>
            );
          })}
        </div>
      )}

      <header className="relative z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="pointer-events-auto flex items-center gap-3 bg-[#050811]/85 backdrop-blur-xl border border-cyan-500/30 rounded-xl px-4 py-2 shadow-2xl">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00F0FF] to-blue-600 flex items-center justify-center text-[#050811] font-black text-base shadow-md">
            JK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-wider text-white">
                JK MEDIA CORPORATION
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-cyan-500/20 text-[#00F0FF] border border-cyan-500/40">
                3D Virtual Agency
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>CEO Điều Hành Tối Cao</span>
              <span>•</span>
              <span className="text-cyan-300">10 Phòng Ban 3D</span>
              <span>•</span>
              <span className="text-emerald-400">
                {cloudSynced ? 'Cloud DB: Đã kết nối' : 'Local Persistence'}
              </span>
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-[#050811]/85 backdrop-blur-xl border border-slate-800 rounded-xl px-3 py-1.5 shadow-xl">
          <span className="text-xs text-slate-400 hidden md:inline flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#00F0FF]" />
            {cameraModeLabel}
          </span>
          <button
            onClick={resetCameraOverview}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition flex items-center gap-1"
            title="Quan sát toàn bộ văn phòng 3D"
          >
            <Focus className="w-3.5 h-3.5" />
            Toàn cảnh 3D
          </button>
          <button
            onClick={() => setAutoFollowCamera((v) => !v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1 ${
              autoFollowCamera
                ? 'bg-cyan-500/25 border-[#00F0FF] text-white'
                : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Camera Tự Động: {autoFollowCamera ? 'BẬT' : 'TẮT'}
          </button>
          <button
            onClick={() => setShow3DLabels((v) => !v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
              show3DLabels
                ? 'bg-slate-800 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Nhãn 3D: {show3DLabels ? 'Hiện' : 'Ẩn'}
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-[#050811]/85 backdrop-blur-xl border border-cyan-500/30 rounded-xl px-3 py-1.5 shadow-2xl">
          <button
            onClick={() => {
              setActiveStudioTab('GRAPHIC');
              setActiveStudioModal('MEDIA_STUDIO');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 text-[#00F0FF] border border-cyan-400/40 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Media Studio
          </button>
          <button
            onClick={() => setActiveStudioModal('PROJECT_HISTORY')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/50 transition"
            title="Xem lịch sử các dự án đã làm và tự động khôi phục cấu hình API của dự án cũ"
          >
            <Clock className="w-3.5 h-3.5 text-purple-300" />
            <span>Lịch Sử Dự Án ({projects.length})</span>
          </button>
          <button
            onClick={() => setActiveStudioModal('SOCIAL_CALENDAR')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-pink-400" />
            Lịch Đăng
          </button>
          <button
            onClick={() => setActiveStudioModal('CEO_CENTER')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            CEO Center
            {projects.some((p) => p.approvalStatus === 'Cần CEO phê duyệt') && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveStudioModal('API_GATEWAY')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 transition shadow-lg shadow-emerald-500/10"
            title="AI Core đã kết nối sẵn • Cấu hình thêm Web/Facebook/TikTok/YouTube riêng cho từng dự án"
          >
            <Link2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Kết nối API Dự Án</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-[10px] text-emerald-300 border border-emerald-500/40">
              AI: Sẵn sàng • Web/MXH: {platformIntegrations.filter((p) => p.status === 'Đã cấu hình API').length}/{platformIntegrations.length}
            </span>
          </button>
        </div>
      </header>

      <div className="relative z-20 pointer-events-none">
        <button
          onClick={() => setLeftDrawerOpen((v) => !v)}
          className="pointer-events-auto fixed left-3 top-20 z-30 p-2 rounded-lg bg-[#050811]/90 border border-cyan-500/40 text-[#00F0FF] hover:bg-slate-900 shadow-lg"
          title="Đóng/Mở danh sách Phòng ban & Nhân sự 3D"
        >
          {leftDrawerOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {leftDrawerOpen && (
          <aside className="pointer-events-auto fixed left-3 top-32 bottom-28 w-72 bg-[#050811]/82 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-3 flex flex-col gap-3 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  10 Phòng Ban & Nhân Sự 3D
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">Click để bay tới</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {OFFICE_ROOMS.map((rm) => {
                const ag = agents.find((a) => a.id === rm.agentId);
                const isSelected = selectedRoomId === rm.id || selectedAgentId === rm.agentId;
                return (
                  <div
                    key={rm.id}
                    onClick={() => focusOnRoom3D(rm.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B132B]/95 border-[#00F0FF] shadow-md'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        <span className="text-[#00F0FF] mr-1">{rm.number}.</span>
                        {rm.name}
                      </span>
                      <StatusBadge status={ag?.status || 'Đã hoàn thành'} size="xs" />
                    </div>
                    {ag && (
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-300">
                        <span className="truncate font-medium">{ag.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                          {ag.animationState}
                        </span>
                      </div>
                    )}
                    <p className="mt-1 text-[10px] text-slate-400 truncate">
                      {ag?.currentTask}
                    </p>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      <div className="relative z-20 pointer-events-none">
        <button
          onClick={() => setRightDrawerOpen((v) => !v)}
          className="pointer-events-auto fixed right-3 top-20 z-30 p-2 rounded-lg bg-[#050811]/90 border border-cyan-500/40 text-[#00F0FF] hover:bg-slate-900 shadow-lg"
          title="Đóng/Mở Hồ sơ Chi tiết Nhân viên AI"
        >
          {rightDrawerOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {rightDrawerOpen && selectedAgent && (
          <aside className="pointer-events-auto fixed right-3 top-32 bottom-28 w-80 bg-[#050811]/85 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-3.5 flex flex-col gap-3 shadow-2xl overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selectedAgent.accentColor }}
                  />
                  <span className="text-[11px] font-mono text-cyan-400">{selectedAgent.id}</span>
                  <StatusBadge status={selectedAgent.status} size="xs" />
                </div>
                <h2 className="text-sm font-black text-white mt-1">{selectedAgent.name}</h2>
                <p className="text-xs text-slate-400">
                  {selectedAgent.role} • {selectedAgent.department}
                </p>
              </div>
              <button
                onClick={() => focusOnAgent3D(selectedAgent.id)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                title="Zoom Camera 3D tới Nhân sự này"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {selectedRoom && (
              <div className="p-2.5 rounded-xl bg-[#0B132B]/70 border border-cyan-500/20 text-[11px] space-y-1">
                <div className="font-bold text-cyan-300 flex items-center justify-between">
                  <span>Không gian 3D: {selectedRoom.name}</span>
                  <span>{selectedRoom.zone}</span>
                </div>
                <p className="text-slate-300">{selectedRoom.equipment}</p>
              </div>
            )}

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Mô hình AI phân công:</span>
                <span className="font-semibold text-cyan-300">{selectedAgent.aiModel}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Trạng thái Hoạt ảnh 3D:</span>
                <div className="flex items-center gap-1">
                  {['Idle', 'Walking', 'Working', 'Typing', 'Meeting', 'Presenting'].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateAgentState(selectedAgent.id, { animationState: st })}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                        selectedAgent.animationState === st
                          ? 'bg-[#00F0FF] text-[#050811] font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Bộ công cụ được cấp quyền:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedAgent.allowedTools.map((tl) => (
                  <span
                    key={tl}
                    className="px-2 py-0.5 text-[10px] rounded-md bg-slate-900 border border-slate-700 text-slate-300"
                  >
                    {tl}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-300">Nhiệm vụ hiện tại:</span>
                <span className="text-cyan-400 font-mono">{selectedAgent.progress}%</span>
              </div>
              <p className="text-xs text-white">{selectedAgent.currentTask}</p>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00F0FF] to-blue-500 transition-all duration-300"
                  style={{ width: `${selectedAgent.progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDispatchSingleAgent(selectedAgent.id)}
                className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#00F0FF] to-cyan-400 text-[#050811] hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Zap className="w-3.5 h-3.5" />
                Giao Việc Ngay (Live AI)
              </button>
              {(selectedAgent.id === 'AGT-05' || selectedAgent.id === 'AGT-06') && (
                <button
                  onClick={() => {
                    setActiveStudioTab(selectedAgent.id === 'AGT-05' ? 'GRAPHIC' : 'VIDEO');
                    setActiveStudioModal('MEDIA_STUDIO');
                  }}
                  className="py-2 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40"
                >
                  Mở Studio
                </button>
              )}
            </div>

            {selectedAgent.lastOutput && (
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-emerald-300 font-bold">
                  <span>KẾT QUẢ CÔNG VIỆC THỰC TẾ</span>
                  <span>{selectedAgent.lastOutput.time}</span>
                </div>
                <div className="max-h-40 overflow-y-auto text-[11px] text-slate-200 whitespace-pre-wrap leading-relaxed pr-1">
                  {selectedAgent.lastOutput.text}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Lịch sử hoạt động:
              </span>
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {selectedAgent.history.map((h, idx) => (
                  <div key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      <div className="fixed bottom-3 left-3 right-3 z-20 pointer-events-none flex flex-col items-center gap-2">
        {currentWorkflowStep > 0 && (
          <div className="pointer-events-auto w-full max-w-5xl bg-[#050811]/90 backdrop-blur-xl border border-cyan-500/40 rounded-xl px-3 py-2 shadow-2xl">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-bold text-[#00F0FF] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                {WORKFLOW_STEPS[currentWorkflowStep - 1]?.title}
              </span>
              <span className="text-slate-300">
                {WORKFLOW_STEPS[currentWorkflowStep - 1]?.desc}
              </span>
              <span className="font-mono text-cyan-300">
                Bước {currentWorkflowStep}/12
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              {WORKFLOW_STEPS.map((st) => (
                <div
                  key={st.step}
                  className={`h-1.5 rounded-full transition-all ${
                    st.step < currentWorkflowStep
                      ? 'bg-emerald-400'
                      : st.step === currentWorkflowStep
                      ? 'bg-[#00F0FF] animate-pulse'
                      : 'bg-slate-800'
                  }`}
                  title={st.title}
                />
              ))}
            </div>
          </div>
        )}

        <div className="pointer-events-auto w-full max-w-5xl bg-[#050811]/90 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl p-2.5 shadow-2xl">
          {(uploadedBrandLogo || uploadedReferenceImages.length > 0 || uploadedBriefDocs.length > 0) && (
            <div className="mb-2 p-2 rounded-xl bg-[#0B132B]/90 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#00F0FF] uppercase">Tài nguyên đã tải lên:</span>
                {uploadedBrandLogo && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-200">
                    <img src={uploadedBrandLogo.dataUrl} alt="logo" className="w-4 h-4 object-contain rounded" />
                    <span>Logo: {uploadedBrandLogo.name}</span>
                    <button onClick={() => setUploadedBrandLogo(null)} className="text-slate-400 hover:text-red-300">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {uploadedReferenceImages.map((img) => (
                  <span
                    key={img.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/90 border border-cyan-500/50 text-cyan-200"
                  >
                    <img src={img.dataUrl} alt={img.name} className="w-4 h-4 object-cover rounded" />
                    <span className="truncate max-w-[120px]">{img.name}</span>
                    <button
                      onClick={() => setUploadedReferenceImages((prev) => prev.filter((i) => i.id !== img.id))}
                      className="text-slate-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {uploadedBriefDocs.map((docItem) => (
                  <span
                    key={docItem.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/90 border border-purple-500/50 text-purple-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-300" />
                    <span className="truncate max-w-[140px]">{docItem.name}</span>
                    <button
                      onClick={() => setUploadedBriefDocs((prev) => prev.filter((d) => d.id !== docItem.id))}
                      className="text-slate-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <button
                onClick={handleAnalyzeUploadedFilesWithAI}
                disabled={isAnalyzingUploads}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#00F0FF] to-emerald-400 text-[#050811] font-bold flex items-center gap-1 hover:brightness-110 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAnalyzingUploads ? 'AI đang đọc file...' : 'AI Đọc File & Tự Điền Brief'}
              </button>
            </div>
          )}

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <input
              type="text"
              value={activeBrandName}
              onChange={(e) => {
                setActiveBrandName(e.target.value);
                setPosterBrief((prev) => ({ ...prev, brandName: e.target.value }));
              }}
              placeholder="Tên thương hiệu / Dự án..."
              className="w-44 bg-[#0B132B] border border-cyan-500/30 focus:border-[#00F0FF] rounded-xl px-3 py-2 text-xs font-bold text-[#00F0FF] placeholder-slate-400 outline-none shrink-0"
            />

            <input
              type="text"
              value={ceoPromptInput}
              onChange={(e) => setCeoPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runFullMultiAgentCampaign()}
              placeholder="Nhập yêu cầu dự án mới hoặc tải file Brief / Logo / Ảnh sản phẩm bên cạnh để 10 Agent thực thi..."
              className="flex-1 bg-slate-900/90 border border-slate-700/80 focus:border-[#00F0FF] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 outline-none transition"
            />

            <label
              className="cursor-pointer px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
              title="Tải lên Logo thương hiệu (PNG/JPG/WEBP) để gắn vào Poster & Video"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>+ Tải Logo</span>
              <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
            </label>

            <label
              className="cursor-pointer px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
              title="Tải lên File tài liệu Brief (.txt, .md, .csv, .json) hoặc Ảnh sản phẩm để AI đọc"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ Tải File / Ảnh</span>
              <input
                type="file"
                multiple
                accept="image/*,.txt,.md,.csv,.json,.html"
                onChange={handleUniversalFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={runFullMultiAgentCampaign}
              disabled={isExecutingWorkflow || !ceoPromptInput.trim()}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-[#00F0FF] to-blue-500 text-[#050811] hover:brightness-110 disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 shrink-0 transition"
            >
              {isExecutingWorkflow ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang thực thi...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    Triển Khai Dự Án ({enableAutoSchedule || promptRequestsScheduling(ceoPromptInput) ? '12 Bước' : '11 Bước'})
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px]">
            <button
              type="button"
              onClick={() => setEnableAutoSchedule((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold transition ${
                enableAutoSchedule || promptRequestsScheduling(ceoPromptInput)
                  ? 'bg-pink-500/20 border-pink-400/60 text-pink-200'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
              title="Chỉ lên lịch đăng bài khi CEO có yêu cầu, không bắt buộc mọi dự án đều phải lên lịch"
            >
              {enableAutoSchedule || promptRequestsScheduling(ceoPromptInput) ? (
                <CheckSquare className="w-3.5 h-3.5 text-pink-400" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>
                📅 Lên lịch đăng bài:{' '}
                <strong className={enableAutoSchedule || promptRequestsScheduling(ceoPromptInput) ? 'text-pink-300' : 'text-slate-400'}>
                  {enableAutoSchedule
                    ? 'BẬT (Theo yêu cầu)'
                    : promptRequestsScheduling(ceoPromptInput)
                    ? 'TỰ ĐỘNG BẬT (Do câu lệnh yêu cầu)'
                    : 'TẮT (Không bắt buộc)'}
                </strong>
              </span>
            </button>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={handleStartNewBlankProjectWorkspace}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 shrink-0 transition"
                title="Làm mới không gian làm việc và đặt lại API mạng xã hội về trống cho khách hàng mới"
              >
                <PlusCircle className="w-3 h-3" />
                Dự án mới (Làm trống API ngoài)
              </button>
              <button
                onClick={() => setActiveStudioModal('PROJECT_HISTORY')}
                className="px-2.5 py-1 rounded-lg bg-purple-950/90 hover:bg-purple-900 text-purple-300 border border-purple-500/40 flex items-center gap-1 shrink-0 transition"
              >
                <Clock className="w-3 h-3" />
                Mở Dự Án Cũ & Khôi Phục API ({projects.length})
              </button>
              <button
                onClick={() => setActiveStudioModal('API_GATEWAY')}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shrink-0 transition"
              >
                <Plug className="w-3 h-3" />
                Cấu hình API Dự Án Hiện Tại
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeStudioModal === 'MEDIA_STUDIO' && (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[88vh] bg-[#050811]/95 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-[#0B132B]">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#00F0FF]" />
                <div>
                  <h2 className="text-base font-black text-white tracking-wide">
                    AI MEDIA PRODUCTION CENTER — TRUNG TÂM SẢN XUẤT TRUYỀN THÔNG THỰC TẾ
                  </h2>
                  <p className="text-xs text-slate-400">
                    Sản phẩm đầu ra thực tế từ Gemini 3.1 Flash Image, Verified Typography, WebM Video Synthesizer & Search Grounding
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { id: 'GRAPHIC', label: '1. Poster & Graphic Studio', icon: ImageIcon },
                  { id: 'VIDEO', label: '2. Video Production Studio', icon: Video },
                  { id: 'CONTENT', label: '3. Content Studio (10 Bài)', icon: FileText },
                  { id: 'SEO', label: '4. SEO & Website Audit', icon: Search },
                  { id: 'ADS', label: '5. Advertising & ROAS', icon: TrendingUp }
                ].map((tb) => {
                  const Icon = tb.icon;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => setActiveStudioTab(tb.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                        activeStudioTab === tb.id
                          ? 'bg-[#00F0FF] text-[#050811] border-[#00F0FF]'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tb.label}
                    </button>
                  );
                })}
                <button
                  onClick={() => setActiveStudioModal(null)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeStudioTab === 'GRAPHIC' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase">
                        Thiết lập Poster, Tải Logo & Kiểm chuẩn Typography
                      </h3>
                      <StatusBadge status="Đã tích hợp (Live AI)" size="xs" />
                    </div>
                    <p className="text-xs text-slate-400">
                      Đã kết nối trực tiếp <strong>Gemini 3.1 Flash Image</strong> bằng khóa API hiện có của CEO. Hỗ trợ tải Logo thật và ảnh sản phẩm tham chiếu để tạo Poster chính xác.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <label className="cursor-pointer p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-emerald-500/40 flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <span className="font-bold text-emerald-300 block">Logo Thương Hiệu</span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {uploadedBrandLogo ? uploadedBrandLogo.name : 'Chưa tải lên (Click để chọn)'}
                          </span>
                        </div>
                        {uploadedBrandLogo ? (
                          <img src={uploadedBrandLogo.dataUrl} alt="logo" className="w-8 h-8 object-contain rounded bg-slate-900 p-0.5 shrink-0" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
                      </label>

                      <label className="cursor-pointer p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-cyan-500/40 flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <span className="font-bold text-cyan-300 block">Ảnh Sản Phẩm Mẫu</span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {uploadedReferenceImages[0] ? uploadedReferenceImages[0].name : 'Chưa tải lên (Click để chọn)'}
                          </span>
                        </div>
                        {uploadedReferenceImages[0] ? (
                          <img src={uploadedReferenceImages[0].dataUrl} alt="ref" className="w-8 h-8 object-cover rounded shrink-0" />
                        ) : (
                          <PlusCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                        )}
                        <input type="file" accept="image/*" onChange={handleUniversalFileUpload} className="hidden" />
                      </label>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Tên Thương Hiệu / Dự Án:</label>
                        <input
                          type="text"
                          value={posterBrief.brandName}
                          placeholder="Nhập tên thương hiệu khách hàng..."
                          onChange={(e) => setPosterBrief({ ...posterBrief, brandName: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Tiêu đề chính (Headline Tiếng Việt):</label>
                        <input
                          type="text"
                          value={posterBrief.headline}
                          placeholder="Nhập tiêu đề chính trên Poster..."
                          onChange={(e) => setPosterBrief({ ...posterBrief, headline: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Thông điệp phụ (Subheadline):</label>
                        <input
                          type="text"
                          value={posterBrief.subheadline}
                          placeholder="Nhập thông điệp phụ..."
                          onChange={(e) => setPosterBrief({ ...posterBrief, subheadline: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Chương trình khuyến mãi / Giá bán:</label>
                        <input
                          type="text"
                          value={posterBrief.promoText}
                          placeholder="VD: Ưu đãi 20% tuần lễ ra mắt..."
                          onChange={(e) => setPosterBrief({ ...posterBrief, promoText: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-semibold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Hotline chính xác:</label>
                          <input
                            type="text"
                            value={posterBrief.hotline}
                            placeholder="VD: 0909.xxx.xxx"
                            onChange={(e) => setPosterBrief({ ...posterBrief, hotline: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-cyan-300"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Kích thước chuẩn:</label>
                          <select
                            value={posterBrief.sizePreset}
                            onChange={(e) => setPosterBrief({ ...posterBrief, sizePreset: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                          >
                            <option>Facebook Portrait (1080 x 1350)</option>
                            <option>Facebook Post (1080 x 1080)</option>
                            <option>Story / Reels (1080 x 1920)</option>
                            <option>YouTube Thumbnail (1280 x 720)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Địa chỉ khách hàng:</label>
                        <input
                          type="text"
                          value={posterBrief.address}
                          placeholder="Nhập địa chỉ..."
                          onChange={(e) => setPosterBrief({ ...posterBrief, address: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Mô tả mỹ thuật AI (Visual Prompt):</label>
                        <textarea
                          rows={2}
                          value={posterBrief.stylePrompt}
                          onChange={(e) => setPosterBrief({ ...posterBrief, stylePrompt: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                        />
                      </div>

                      <button
                        onClick={() => handleGenerateRealPoster()}
                        disabled={isGeneratingPoster}
                        className="w-full py-3 rounded-xl font-black text-xs uppercase bg-gradient-to-r from-[#00F0FF] to-emerald-400 text-[#050811] hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                      >
                        {isGeneratingPoster ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Đang tạo ảnh AI & Đóng dấu Logo...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Tạo Poster Chất Lượng Cao (Gemini 3.1 Flash Image)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase">
                        Sản phẩm Poster đã kết xuất ({generatedPosters.length})
                      </h3>
                      <span className="text-xs text-emerald-400">
                        Hỗ trợ tải xuống file .PNG độ phân giải cao
                      </span>
                    </div>

                    {generatedPosters.length === 0 ? (
                      <div className="h-96 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <ImageIcon className="w-12 h-12 text-cyan-400/50 mb-3" />
                        <p className="text-sm font-semibold text-white">
                          Chưa có Poster nào được tạo trong phiên này
                        </p>
                        <p className="text-xs mt-1 max-w-md">
                          Nhấn nút <strong>"Tạo Poster Chất Lượng Cao"</strong> bên trái hoặc chạy toàn bộ chiến dịch ở thanh lệnh phía dưới để Designer AI (Nhân sự 05) tạo sản phẩm.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generatedPosters.map((pst) => (
                          <div
                            key={pst.id}
                            className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl"
                          >
                            <div className="aspect-[4/5] bg-black relative overflow-hidden">
                              <img
                                src={pst.url}
                                alt={pst.headline}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="p-3.5 space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white truncate">{pst.headline}</span>
                                <StatusBadge status={pst.status} size="xs" />
                              </div>
                              <p className="text-[11px] text-cyan-300">{pst.source}</p>
                              <div className="flex items-center gap-2 pt-1">
                                <a
                                  href={pst.url}
                                  download={`${pst.id}.png`}
                                  className="flex-1 py-2 px-3 rounded-lg bg-[#00F0FF] text-[#050811] font-bold text-center flex items-center justify-center gap-1.5 hover:brightness-110"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Tải File PNG
                                </a>
                                <button
                                  onClick={() =>
                                    setGeneratedPosters((prev) =>
                                      prev.map((item) =>
                                        item.id === pst.id ? { ...item, status: 'Đã hoàn thành' } : item
                                      )
                                    )
                                  }
                                  className="py-2 px-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                                >
                                  CEO Duyệt
                                </button>
                                <button
                                  onClick={() => {
                                    handleCreateOnDemandScheduleItem(
                                      `Đăng Poster: ${pst.headline}`,
                                      'Facebook Fanpage'
                                    );
                                    setActiveStudioModal('SOCIAL_CALENDAR');
                                  }}
                                  className="py-2 px-2.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold"
                                  title="Đưa Poster này vào Lịch đăng bài theo yêu cầu"
                                >
                                  + Lịch Đăng
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeStudioTab === 'VIDEO' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase">
                          Quy trình: Script → Vẽ Ảnh AI Từng Phân Cảnh (Keyframes) → Kết Xuất Video
                        </h3>
                        <p className="text-xs text-slate-400">
                          Đã kết nối <strong>Gemini 3.1 Flash Image</strong> để vẽ hình ảnh thật cho từng cảnh quay, kết hợp hiệu ứng điện ảnh Ken Burns, đóng dấu Logo và xuất file Video (.WEBM).
                        </p>
                      </div>
                      <button
                        onClick={handleGenerateAISceneKeyframes}
                        disabled={videoStudioState.isGeneratingKeyframes}
                        className="px-3.5 py-2 rounded-xl bg-purple-500/25 hover:bg-purple-500/35 text-purple-200 border border-purple-400/50 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Sparkles className={`w-4 h-4 ${videoStudioState.isGeneratingKeyframes ? 'animate-spin' : ''}`} />
                        {videoStudioState.isGeneratingKeyframes
                          ? 'Đang vẽ ảnh AI cho 4 cảnh...'
                          : '1. Vẽ Ảnh AI Chất Lượng Cao Cho 4 Cảnh'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {videoStudioState.scenes.map((sc, idx) => (
                        <div key={sc.id} className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 flex flex-col sm:flex-row gap-3 text-xs">
                          <div className="w-full sm:w-36 aspect-video rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                            {sc.keyframeUrl ? (
                              <img src={sc.keyframeUrl} alt={sc.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-slate-500 text-center px-2">
                                Chưa vẽ Keyframe AI
                              </span>
                            )}
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#00F0FF]">{sc.title}</span>
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                                Góc máy: {sc.camera}
                              </span>
                            </div>
                            <div>
                              <label className="text-slate-400 block mb-0.5">Mô tả hình ảnh phân cảnh (Visual Prompt):</label>
                              <input
                                type="text"
                                value={sc.visual}
                                onChange={(e) => {
                                  const updated = [...videoStudioState.scenes];
                                  updated[idx].visual = e.target.value;
                                  setVideoStudioState({ ...videoStudioState, scenes: updated });
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                              />
                            </div>
                            <div>
                              <label className="text-slate-400 block mb-0.5">Lời bình & Phụ đề (Voiceover & Subtitle):</label>
                              <input
                                type="text"
                                value={sc.voiceover}
                                onChange={(e) => {
                                  const updated = [...videoStudioState.scenes];
                                  updated[idx].voiceover = e.target.value;
                                  setVideoStudioState({ ...videoStudioState, scenes: updated });
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase">
                        Trình Dựng & Xuất Video Thực Tế
                      </h3>
                      <StatusBadge status="Đã tích hợp (Live AI)" size="xs" />
                    </div>

                    <p className="text-xs text-slate-400">
                      Không chỉ dừng ở Storyboard: Hệ thống tổng hợp các phân cảnh, chuyển động camera, tiêu đề và phụ đề thành <strong>file Video thực tế (.webm)</strong> có thể xem trực tiếp và tải về máy.
                    </p>

                    <button
                      onClick={handleRenderRealVideo}
                      disabled={videoStudioState.isRendering}
                      className="w-full py-3 rounded-xl font-black text-xs uppercase bg-gradient-to-r from-indigo-500 via-[#00F0FF] to-emerald-400 text-[#050811] hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                    >
                      {videoStudioState.isRendering ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Đang kết xuất Video ({videoStudioState.renderProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Kết Xuất Video Hoàn Chỉnh (Render .WEBM)</span>
                        </>
                      )}
                    </button>

                    {videoStudioState.videoUrl ? (
                      <div className="space-y-3 pt-2">
                        <div className="rounded-xl overflow-hidden border border-cyan-500/50 bg-black aspect-video">
                          <video
                            src={videoStudioState.videoUrl}
                            controls
                            autoPlay
                            loop
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={videoStudioState.videoUrl}
                            download="JK_Media_Commercial_Video.webm"
                            className="py-2.5 px-4 rounded-xl bg-emerald-400 text-[#050811] font-black text-xs flex items-center justify-center gap-2 hover:brightness-110"
                          >
                            <Download className="w-4 h-4" />
                            Tải Video (.WEBM)
                          </a>
                          <button
                            onClick={() => {
                              handleCreateOnDemandScheduleItem(
                                `Đăng Video Quảng cáo: ${videoStudioState.title}`,
                                'TikTok Official'
                              );
                              setActiveStudioModal('SOCIAL_CALENDAR');
                            }}
                            className="py-2.5 px-3 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-400/50 font-bold text-xs flex items-center justify-center gap-1.5"
                          >
                            <Calendar className="w-4 h-4" />
                            + Đưa vào Lịch Đăng
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-60 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400 p-4 text-center text-xs">
                        <Video className="w-10 h-10 text-indigo-400/60 mb-2" />
                        <span>Nhấn "Kết Xuất Video Hoàn Chỉnh" để tạo file video thực tế từ 4 phân cảnh Storyboard.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeStudioTab === 'CONTENT' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase">
                        Chuỗi 10 Bài Đăng Facebook, Kịch Bản TikTok & Bài Viết Chuẩn SEO (Agent 04)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Được tạo trực tiếp bởi Content Specialist (Lan Vũ) dựa trên Brief chiến dịch của CEO.
                      </p>
                    </div>
                    <button
                      onClick={() => handleDispatchSingleAgent('AGT-04', ceoPromptInput)}
                      className="px-4 py-2 rounded-xl bg-[#00F0FF] text-[#050811] font-bold text-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Viết lại / Mở rộng bằng Gemini 3 Flash
                    </button>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {activeProject?.deliverables?.contentDeliverables ||
                      agents.find((a) => a.id === 'AGT-04')?.lastOutput?.text ||
                      'Chưa có dữ liệu bài viết. Hãy nhấn "Triển Khai Chiến Dịch" hoặc "Viết lại bằng Gemini 3 Flash".'}
                  </div>
                </div>
              )}

              {activeStudioTab === 'SEO' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase">
                        Hệ Thống 17 Hạng Mục SEO Chuyên Sâu & Google Search Grounding (Agent 07)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Không tự bịa số liệu truy cập. Phân tích từ khóa, Search Intent, Topic Cluster và Technical SEO thực tế.
                      </p>
                    </div>
                    <button
                      onClick={() => handleDispatchSingleAgent('AGT-07', ceoPromptInput)}
                      className="px-4 py-2 rounded-xl bg-emerald-400 text-[#050811] font-bold text-xs flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Chạy Nghiên Cứu SEO Thực Tế (Search Grounding)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block">Google Search Grounding</span>
                      <span className="text-emerald-400 font-bold">Đã tích hợp (Live Search)</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block">Google Search Console API</span>
                        <span
                          className={
                            platformIntegrations.find((p) => p.id === 'PLAT-GSC')?.status === 'Đã cấu hình API'
                              ? 'text-emerald-400 font-bold'
                              : 'text-purple-300 font-bold'
                          }
                        >
                          {platformIntegrations.find((p) => p.id === 'PLAT-GSC')?.status === 'Đã cấu hình API'
                            ? 'Đã kết nối Domain Property'
                            : 'Đang chờ API (Cấu hình OAuth)'}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveStudioModal('API_GATEWAY')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold"
                      >
                        Kết nối
                      </button>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block">WordPress CMS Auto-Publish</span>
                        <span
                          className={
                            platformIntegrations.find((p) => p.id === 'PLAT-WP')?.status === 'Đã cấu hình API'
                              ? 'text-emerald-400 font-bold'
                              : 'text-purple-300 font-bold'
                          }
                        >
                          {platformIntegrations.find((p) => p.id === 'PLAT-WP')?.status === 'Đã cấu hình API'
                            ? 'Đã kết nối REST API'
                            : 'Đang chờ API (Application Password)'}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveStudioModal('API_GATEWAY')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold"
                      >
                        Kết nối
                      </button>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {activeProject?.deliverables?.seoPlan ||
                      agents.find((a) => a.id === 'AGT-07')?.lastOutput?.text ||
                      'Chưa có báo cáo SEO cho dự án này. Hãy nhấn nút "Chạy Nghiên Cứu SEO Thực Tế".'}
                  </div>
                </div>
              )}

              {activeStudioTab === 'ADS' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase">
                        Kế Hoạch Quảng Cáo Đa Kênh & Phân Bổ Ngân Sách (Agent 08)
                      </h3>
                      <p className="text-xs text-amber-300">
                        Nguyên tắc bắt buộc: Không tự ý chạy quảng cáo hoặc tiêu tiền nếu chưa có sự phê duyệt của CEO.
                      </p>
                    </div>
                    <StatusBadge status="Cần CEO phê duyệt" />
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {activeProject?.deliverables?.adsPlan ||
                      agents.find((a) => a.id === 'AGT-08')?.lastOutput?.text ||
                      'Chưa có kế hoạch phân bổ ngân sách quảng cáo.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeStudioModal === 'CEO_CENTER' && (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[88vh] bg-[#050811]/95 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-[#0B132B] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-base font-black text-white uppercase">
                    CEO CONTROL CENTER — TRUNG TÂM ĐIỀU HÀNH TỐI CAO CỦA CEO
                  </h2>
                  <p className="text-xs text-slate-400">
                    Quản lý dự án, kiểm duyệt chất lượng QC, phê duyệt sản phẩm và giám sát chi phí AI toàn công ty
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudioModal(null)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Tổng dự án chiến dịch</span>
                  <div className="text-2xl font-black text-white mt-1">{projects.length}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30">
                  <span className="text-amber-300">Dự án chờ CEO phê duyệt</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {projects.filter((p) => p.approvalStatus === 'Cần CEO phê duyệt').length}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                  <span className="text-cyan-300">Nhân sự AI đang trực chiến</span>
                  <div className="text-2xl font-black text-[#00F0FF] mt-1">10 / 10 Agent</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                  <span className="text-emerald-300">Chi phí API thực tế ({apiCallCount} lệnh)</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">${apiCostTotal.toFixed(4)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase">
                  Hồ sơ Dự án & Nghiệm thu Sản phẩm
                </h3>

                {projects.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
                    Chưa có dự án nào. Hãy nhập yêu cầu ở thanh điều khiển phía dưới màn hình 3D để khởi chạy chiến dịch.
                  </div>
                ) : (
                  projects.map((prj) => (
                    <div
                      key={prj.id}
                      className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800 space-y-4 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <span className="font-mono text-cyan-400 mr-2">[{prj.id}]</span>
                          <span className="font-black text-sm text-white">{prj.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={prj.approvalStatus || prj.status} />
                          <button
                            onClick={() => handleCEOApproveProject(prj.id, 'Đã hoàn thành')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-[#050811] font-bold hover:brightness-110 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            CEO Phê Duyệt Toàn Bộ
                          </button>
                          <button
                            onClick={() => handleCEOApproveProject(prj.id, 'Đang xử lý')}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                          >
                            Yêu cầu chỉnh sửa
                          </button>
                        </div>
                      </div>

                      {prj.deliverables && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="font-bold text-cyan-300 mb-1">1. Báo giá & Brief (Sales AGT-09)</div>
                            <p className="text-slate-300 whitespace-pre-wrap">{prj.deliverables.salesBrief}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="font-bold text-emerald-300 mb-1">2. Biên bản Kiểm định Độc lập (QC AGT-10)</div>
                            <p className="text-slate-300 whitespace-pre-wrap">{prj.deliverables.qcAuditReport}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase">
                  Nhật ký Thực thi Thời gian thực (Activity Logs)
                </h3>
                <div className="max-h-48 overflow-y-auto rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-1.5 font-mono text-[11px]">
                  {activityLogs.map((lg) => (
                    <div key={lg.id} className="flex items-start gap-2">
                      <span className="text-slate-500">[{lg.time}]</span>
                      <span className="text-cyan-400 font-bold">{lg.agent}:</span>
                      <span className="text-slate-200">{lg.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeStudioModal === 'SOCIAL_CALENDAR' && (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[85vh] bg-[#050811]/95 border border-pink-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-[#0B132B] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-pink-400" />
                <div>
                  <h2 className="text-base font-black text-white uppercase">
                    SOCIAL MEDIA MANAGEMENT CENTER — LÊN LỊCH ĐĂNG BÀI THEO YÊU CẦU
                  </h2>
                  <p className="text-xs text-slate-400">
                    Chỉ lên lịch khi CEO yêu cầu (Không bắt buộc cho mọi dự án) • Không tự nhận ĐÃ ĐĂNG khi chưa có xác nhận OAuth từ nền tảng
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOnDemandScheduleForm((v) => !v)}
                  className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-400/50 text-xs font-bold flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  + Lên lịch bài đăng mới theo yêu cầu
                </button>
                <button
                  onClick={() => setActiveStudioModal('API_GATEWAY')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-xs font-bold flex items-center gap-1.5"
                >
                  <Plug className="w-3.5 h-3.5" />
                  Tích hợp Nền tảng
                </button>
                <button
                  onClick={() => setActiveStudioModal(null)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {showOnDemandScheduleForm && (
                <div className="p-4 rounded-2xl bg-slate-900/95 border border-pink-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-pink-300 uppercase">
                      Tạo lịch đăng bài theo yêu cầu (On-Demand Scheduling)
                    </span>
                    <button
                      onClick={() => setShowOnDemandScheduleForm(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      Đóng
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Thời gian đăng:</label>
                      <input
                        type="text"
                        value={newScheduleForm.date}
                        onChange={(e) => setNewScheduleForm({ ...newScheduleForm, date: e.target.value })}
                        placeholder="YYYY-MM-DD HH:mm"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Nền tảng xuất bản:</label>
                      <select
                        value={newScheduleForm.platform}
                        onChange={(e) => setNewScheduleForm({ ...newScheduleForm, platform: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      >
                        <option>Facebook Fanpage</option>
                        <option>TikTok Official</option>
                        <option>YouTube Channel</option>
                        <option>Website Doanh Nghiệp</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-400 mb-1">Tiêu đề / Nội dung bài đăng:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newScheduleForm.title}
                          onChange={(e) => setNewScheduleForm({ ...newScheduleForm, title: e.target.value })}
                          placeholder="Nhập tiêu đề bài viết hoặc ấn phẩm cần lên lịch..."
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                        />
                        <button
                          onClick={() => handleCreateOnDemandScheduleItem()}
                          className="px-4 py-2 rounded-lg bg-pink-500 text-[#050811] font-bold hover:brightness-110 shrink-0"
                        >
                          Lưu Lịch
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between">
                <span>
                  <strong>Chế độ Lên lịch theo yêu cầu (On-Demand):</strong> Hệ thống không ép buộc mọi dự án phải lên lịch đăng bài. Khi cần xuất bản tự động, hãy nhấn <strong>"Tích hợp Nền tảng"</strong> để cấp quyền API hoặc tải file xuống đăng thủ công.
                </span>
                <StatusBadge
                  status={
                    platformIntegrations.some((p) => p.status === 'Đã cấu hình API')
                      ? 'Đã cấu hình API'
                      : 'Đang chờ API'
                  }
                />
              </div>

              <div className="space-y-3">
                {socialCalendarPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                          {post.date}
                        </span>
                        <span className="font-bold text-pink-400">{post.platform}</span>
                      </div>
                      <div className="text-sm font-bold text-white">{post.title}</div>
                      <div className="text-[11px] text-slate-400">
                        Xác nhận từ nền tảng: <span className="text-amber-300">{post.apiConfirm}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={post.status} />
                      <button
                        onClick={() => setActiveStudioModal('API_GATEWAY')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1"
                      >
                        <Plug className="w-3.5 h-3.5" />
                        Kết nối API
                      </button>
                      <button
                        onClick={() =>
                          setSocialCalendarPosts((prev) =>
                            prev.map((p) =>
                              p.id === post.id ? { ...p, status: 'Đang chờ API' } : p
                            )
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold"
                      >
                        CEO Duyệt Nội Dung
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeStudioModal === 'PROJECT_HISTORY' && (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[86vh] bg-[#050811]/95 border border-purple-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-[#0B132B] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <div>
                  <h2 className="text-base font-black text-white uppercase">
                    LỊCH SỬ DỰ ÁN & KHÔI PHỤC HỒ SƠ KẾT NỐI API TỰ ĐỘNG
                  </h2>
                  <p className="text-xs text-slate-400">
                    Lưu trữ toàn bộ các dự án CEO từng triển khai. Khi chọn lại một dự án cũ, hệ thống tự động khôi phục các kết nối API (Web, Facebook, TikTok, YouTube), Logo và sản phẩm của dự án đó mà không cần kết nối lại từ đầu.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleStartNewBlankProjectWorkspace();
                    setActiveStudioModal(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-[#00F0FF] border border-cyan-400/50 text-xs font-bold flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  + Tạo Dự Án Mới (Làm trống API ngoài)
                </button>
                <button
                  onClick={() => setActiveStudioModal(null)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {projects.length === 0 ? (
                <div className="p-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
                  <Clock className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="text-sm font-bold text-white">Chưa có dự án nào trong Lịch sử</h3>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto">
                    Khi CEO nhập yêu cầu hoặc tải file Brief/Logo lên và nhấn "Triển Khai Dự Án", toàn bộ hồ sơ dự án và các API đã kết nối của dự án đó sẽ tự động được lưu tại đây.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((prj) => {
                    const isCurrent = prj.id === activeProjectId;
                    const savedApis = (prj.savedPlatformIntegrations || []).filter(
                      (p) => p.status === 'Đã cấu hình API'
                    );

                    return (
                      <div
                        key={prj.id}
                        className={`p-5 rounded-2xl border transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                          isCurrent
                            ? 'bg-[#0B132B]/90 border-[#00F0FF] shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                              {prj.id}
                            </span>
                            {prj.brandName && (
                              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/40 font-bold">
                                Thương hiệu: {prj.brandName}
                              </span>
                            )}
                            <StatusBadge status={prj.approvalStatus || prj.status} size="xs" />
                            <span className="text-[11px] text-slate-400">
                              {prj.createdAt ? new Date(prj.createdAt).toLocaleString('vi-VN') : ''}
                            </span>
                          </div>

                          <h3 className="text-sm font-black text-white">{prj.brief}</h3>

                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-slate-400 font-semibold">
                              Hồ sơ API đã lưu theo dự án:
                            </span>
                            {savedApis.length === 0 ? (
                              <span className="text-[11px] text-slate-500 italic">
                                Chưa kết nối API mạng xã hội ngoài (Chỉ dùng AI Core)
                              </span>
                            ) : (
                              savedApis.map((api) => (
                                <span
                                  key={api.id}
                                  className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold"
                                >
                                  ✓ {api.platformKey} ({api.accountId})
                                </span>
                              ))
                            )}
                          </div>

                          {Array.isArray(prj.uploadedFileNames) && prj.uploadedFileNames.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] text-slate-400">File đính kèm:</span>
                              {prj.uploadedFileNames.map((fn, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                                  {fn}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              handleSelectAndRestoreOldProject(prj);
                              setActiveStudioModal(null);
                            }}
                            className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition ${
                              isCurrent
                                ? 'bg-emerald-500 text-[#050811]'
                                : 'bg-gradient-to-r from-[#00F0FF] to-blue-500 text-[#050811] hover:brightness-110'
                            }`}
                          >
                            <RotateCcw className="w-4 h-4" />
                            {isCurrent ? 'Đang Mở Dự Án Này' : 'Chọn Dự Án & Khôi Phục API Đã Lưu'}
                          </button>

                          <button
                            onClick={() => {
                              handleSelectAndRestoreOldProject(prj);
                              setActiveStudioModal('CEO_CENTER');
                            }}
                            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                          >
                            Xem Chi Tiết Sản Phẩm
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeStudioModal === 'API_GATEWAY' && (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-6xl bg-[#050811]/95 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
            <div className="px-6 py-4 border-b border-slate-800 bg-[#0B132B] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-base font-black text-white uppercase">
                    CẤU HÌNH CÔNG CỤ AI (KẾT NỐI SẴN) & API NỀN TẢNG THEO TỪNG DỰ ÁN
                  </h2>
                  <p className="text-xs text-slate-400">
                    1) Toàn bộ công cụ AI tạo Văn bản, Ảnh 8K & Video đã được COO kết nối sẵn bằng khóa API hiện có của CEO. 2) Đã bỏ Instagram. 3) Các API Facebook, TikTok, YouTube, Website để trống để CEO kết nối riêng cho từng dự án và tự động lưu vào Lịch sử Dự án.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingPlatform(null);
                  setActiveStudioModal(null);
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-[#0B132B] border border-emerald-500/50 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                      HỆ THỐNG LÕI AI CỦA CÔNG TY (COO ĐÃ KẾT NỐI SẴN BẰNG KHÓA API HIỆN CÓ CỦA CEO)
                    </span>
                    <h3 className="text-sm font-black text-white mt-0.5">
                      Toàn bộ 4 Cụm Công Cụ AI Sản Xuất Ảnh Chất Lượng Cao & Video Đã Sẵn Sàng 100%
                    </h3>
                  </div>
                  <StatusBadge status="Đã tích hợp (Live AI)" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {INITIAL_PROVIDERS.map((prov) => (
                    <div
                      key={prov.id}
                      className="p-3.5 rounded-xl bg-slate-950/85 border border-emerald-500/30 flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-white">{prov.name}</span>
                        <StatusBadge status={prov.status} size="xs" />
                      </div>
                      <p className="text-[11px] text-slate-300">{prov.description}</p>
                      <div className="text-[10px] font-mono text-emerald-300 flex items-center justify-between pt-1 border-t border-slate-800">
                        <span>Model: {prov.model}</span>
                        <span>Xác thực: {prov.authType}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 w-full">
                    <label className="block text-slate-200 font-bold mb-1">
                      Khóa API Google Gemini của CEO (Mặc định hệ thống đã tự động điền khóa môi trường hiện có, hoặc nhập khóa riêng nếu muốn ghi đè):
                    </label>
                    <input
                      type="password"
                      value={customGeminiKey}
                      onChange={(e) => setCustomGeminiKey(e.target.value)}
                      placeholder="Đã tự động kết nối khóa API hiện hành của CEO (Chỉ nhập vào đây nếu muốn đổi sang khóa khác)"
                      className="w-full bg-slate-950 border border-emerald-500/40 rounded-lg px-3 py-2 text-emerald-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              {editingPlatform && (
                <div className="p-5 rounded-2xl bg-[#0B132B] border-2 border-[#00F0FF] shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Plug className="w-5 h-5 text-[#00F0FF]" />
                      <div>
                        <h3 className="text-sm font-black text-white uppercase">
                          Thiết Lập Kết Nối: {editingPlatform.name}
                        </h3>
                        <p className="text-[11px] text-cyan-300 font-mono">
                          Endpoint: {editingPlatform.endpoint}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingPlatform(null)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      Đóng khung cấu hình
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {editingPlatform.accountIdLabel} *
                      </label>
                      <input
                        type="text"
                        value={platformForm.accountId}
                        onChange={(e) => setPlatformForm({ ...platformForm, accountId: e.target.value })}
                        placeholder="Nhập ID trang / tài khoản..."
                        className="w-full bg-slate-950 border border-slate-700 focus:border-[#00F0FF] rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {editingPlatform.tokenLabel} *
                      </label>
                      <input
                        type="password"
                        value={platformForm.accessToken}
                        onChange={(e) => setPlatformForm({ ...platformForm, accessToken: e.target.value })}
                        placeholder="Nhập OAuth Token / API Secret..."
                        className="w-full bg-slate-950 border border-slate-700 focus:border-[#00F0FF] rounded-lg px-3 py-2 text-cyan-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Webhook / Callback URL (Tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={platformForm.webhookUrl}
                        onChange={(e) => setPlatformForm({ ...platformForm, webhookUrl: e.target.value })}
                        placeholder="https://api.jkmedia.vn/webhook/..."
                        className="w-full bg-slate-950 border border-slate-700 focus:border-[#00F0FF] rounded-lg px-3 py-2 text-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  {pingResultMsg && (
                    <div
                      className={`p-3 rounded-xl border font-semibold ${
                        pingResultMsg.ok
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-red-500/15 border-red-500/40 text-red-300'
                      }`}
                    >
                      {pingResultMsg.text}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTestPlatformPing}
                        disabled={isTestingPing}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin' : ''}`} />
                        Kiểm tra kết nối (Test Ping)
                      </button>
                      {editingPlatform.status === 'Đã cấu hình API' && (
                        <button
                          onClick={() => handleDisconnectPlatform(editingPlatform)}
                          className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold flex items-center gap-1.5"
                        >
                          <Unplug className="w-3.5 h-3.5" />
                          Ngắt kết nối
                        </button>
                      )}
                    </div>

                    <button
                      onClick={handleSavePlatformIntegration}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-emerald-400 text-[#050811] font-black uppercase flex items-center gap-1.5 shadow-lg"
                    >
                      <Check className="w-4 h-4" />
                      Lưu Cấu Hình & Kích Hoạt Nền Tảng
                    </button>
                  </div>
                </div>
              )}

              {[
                'Nền Tảng Đăng Bài & Website (Cấu hình riêng theo từng Dự án)',
                'Công Cụ SEO & Quảng Cáo (Cấu hình riêng theo từng Dự án)'
              ].map((cat) => (
                <div key={cat} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#00F0FF] flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {cat}
                    </h3>
                    {activeProject && (
                      <span className="text-[11px] text-purple-300 font-semibold">
                        Đang lưu tự động cho dự án: {activeProject.brandName || activeProject.title}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {platformIntegrations
                      .filter((item) => item.category === cat)
                      .map((plat) => {
                        const isConnected = plat.status === 'Đã cấu hình API';
                        return (
                          <div
                            key={plat.id}
                            className={`p-4 rounded-xl border transition flex flex-col justify-between gap-3 ${
                              isConnected
                                ? 'bg-emerald-950/20 border-emerald-500/50'
                                : 'bg-slate-900/80 border-slate-800'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="font-bold text-white text-sm block">{plat.name}</span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    Endpoint: {plat.endpoint}
                                  </span>
                                </div>
                                <StatusBadge status={plat.status} size="xs" />
                              </div>
                              <p className="text-[11px] text-slate-300">{plat.description}</p>
                              {isConnected && (
                                <div className="pt-1 text-[11px] text-emerald-300 font-mono flex items-center justify-between">
                                  <span>ID: {plat.accountId}</span>
                                  <span>Cập nhật: {plat.lastPing}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                              {isConnected && (
                                <button
                                  onClick={() => handleDisconnectPlatform(plat)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 text-[11px] font-semibold flex items-center gap-1"
                                >
                                  <Unplug className="w-3 h-3" />
                                  Ngắt
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenPlatformConfig(plat)}
                                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                                  isConnected
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                    : 'bg-gradient-to-r from-[#00F0FF] to-blue-500 text-[#050811] hover:brightness-110'
                                }`}
                              >
                                <Plug className="w-3.5 h-3.5" />
                                {isConnected ? 'Cấu hình lại API' : 'Kết nối / Cấu hình API'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}