
import React, { useState, useEffect } from 'react';
import { Sparkles, Droplet, Sun, Wind, Heart, CheckCircle, ChevronRight, ArrowLeft, ArrowRight, BarChart3, MessageCircle, Send, X, Calendar, TrendingUp, Moon, Zap, Target, LineChart, AlertCircle, CalendarHeartIcon } from 'lucide-react';

// 카카오 SDK 초기화 (실제 앱 키로 교체 필요)
const initKakao = () => {
  if (!window.Kakao) return;
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY); // ← .env 에서 읽음
    console.log('Kakao init:', window.Kakao.isInitialized());
  }
};


// 40개 질문 데이터
const questions = [
  // 1. 지성(OILY) ↔ 건성(DRY) 진단 (Q1-10)
  { id: 1, category: 'OD', type: 'O', question: "세안 후 30분이 지나면\n피부가 번들거린다", scale: true },
  { id: 2, category: 'OD', type: 'O', question: "T존(이마, 코)에\n기름이 많이 생긴다", scale: true },
  { id: 3, category: 'OD', type: 'D', question: "얼굴이 당기거나\n건조한 느낌이 든다", scale: true },
  { id: 4, category: 'OD', type: 'O', question: "모공이 크고\n눈에 잘 띈다", scale: true },
  { id: 5, category: 'OD', type: 'O', question: "기름종이가\n자주 필요하다", scale: true },
  { id: 6, category: 'OD', type: 'D', question: "얼굴에 각질이\n자주 일어난다", scale: true },
  { id: 7, category: 'OD', type: 'O', question: "화장이 기름 때문에\n무너진다", scale: true },
  { id: 8, category: 'OD', type: 'D', question: "보습제를 안 바르면\n매우 불편하다", scale: true },
  { id: 9, category: 'OD', type: 'O', question: "오후가 되면\n피부가 번들거린다", scale: true },
  { id: 10, category: 'OD', type: 'D', question: "세안 직후에도\n피부가 건조하다", scale: true },
  
  // 2. 민감성(SENSITIVE) ↔ 저항성(RESISTANT) 진단 (Q11-20)
  { id: 11, category: 'SR', type: 'S', question: "새로운 화장품을 사용하면\n트러블이 생긴다", scale: true },
  { id: 12, category: 'SR', type: 'S', question: "피부가 쉽게\n붉어진다", scale: true },
  { id: 13, category: 'SR', type: 'S', question: "피부가 따갑거나 가려운\n느낌이 자주 든다", scale: true },
  { id: 14, category: 'SR', type: 'S', question: "계절이나 환경이 바뀌면\n피부 상태가 나빠진다", scale: true },
  { id: 15, category: 'SR', type: 'S', question: "화장품 성분을\n꼼꼼히 확인해야 한다", scale: true },
  { id: 16, category: 'SR', type: 'S', question: "자외선에 노출되면 피부가\n빨갛게 달아오른다", scale: true },
  { id: 17, category: 'SR', type: 'S', question: "스트레스를 받으면\n피부가 바로 반응한다", scale: true },
  { id: 18, category: 'SR', type: 'S', question: "알코올이나 향료가 든 제품을\n사용하면 자극을 느낀다", scale: true },
  { id: 19, category: 'SR', type: 'S', question: "피부에 홍조나 혈관이\n비치는 편이다", scale: true },
  { id: 20, category: 'SR', type: 'S', question: "각질 제거나 필링 후\n피부가 예민해진다", scale: true },
  
  // 3. 색소성(PIGMENTED) ↔ 비색소성(NON-PIGMENTED) 진단 (Q21-30)
  { id: 21, category: 'PN', type: 'P', question: "얼굴에 기미나\n잡티가 있다", scale: true },
  { id: 22, category: 'PN', type: 'P', question: "햇빛에 노출되면\n쉽게 태닝된다", scale: true },
  { id: 23, category: 'PN', type: 'P', question: "상처나 트러블 자리가\n색소침착으로 남는다", scale: true },
  { id: 24, category: 'PN', type: 'P', question: "주근깨나\n검버섯이 있다", scale: true },
  { id: 25, category: 'PN', type: 'P', question: "피부 톤이 불균일하고\n얼룩덜룩하다", scale: true },
  { id: 26, category: 'PN', type: 'P', question: "임신이나 호르몬 변화 시\n기미가 생겼다", scale: true },
  { id: 27, category: 'PN', type: 'P', question: "눈 밑이나 입 주변이\n어둡게 변색되어 있다", scale: true },
  { id: 28, category: 'PN', type: 'P', question: "자외선 차단제를 안 바르면\n피부가 빠르게 어두워진다", scale: true },
  { id: 29, category: 'PN', type: 'P', question: "마찰이나 자극받은 부위가\n어둡게 변한다", scale: true },
  { id: 30, category: 'PN', type: 'P', question: "미백 제품이나 색소 관리가\n필요하다고 느낀다", scale: true },
  
  // 4. 주름(WRINKLED) ↔ 탱탱함(TIGHT) 진단 (Q31-40)
  { id: 31, category: 'WT', type: 'W', question: "눈가에 잔주름이나\n까치발이 있다", scale: true },
  { id: 32, category: 'WT', type: 'W', question: "이마나 미간에\n주름이 있다", scale: true },
  { id: 33, category: 'WT', type: 'W', question: "팔자주름이나 입가 주름이\n신경 쓰인다", scale: true },
  { id: 34, category: 'WT', type: 'W', question: "피부가 처지거나\n탄력이 떨어진다", scale: true },
  { id: 35, category: 'WT', type: 'W', question: "목주름이\n생겼다", scale: true },
  { id: 36, category: 'WT', type: 'W', question: "피부를 눌렀을 때\n바로 회복되지 않는다", scale: true },
  { id: 37, category: 'WT', type: 'W', question: "웃거나 찡그릴 때 생긴 주름이\n표정을 풀어도 남아있다", scale: true },
  { id: 38, category: 'WT', type: 'W', question: "턱선이나 볼 라인이\n흐릿해졌다", scale: true },
  { id: 39, category: 'WT', type: 'W', question: "피부 결이 거칠고\n매끄럽지 않다", scale: true },
  { id: 40, category: 'WT', type: 'W', question: "안티에이징 제품이\n필요하다고 느낀다", scale: true }
];

// 16개 상세 타입 데이터
const skinTypes = {
  "OSPW": {
    type: "OSPW",
    title: "예민한 윤광러",
    emoji: "💧",
    description: "기름진데 예민하고, 잡티도 있고 주름까지... 하지만 관리하면 빛나요!",
    characteristics: [
      "아침에 일어나면 얼굴이 번들번들, 그런데 새 제품 쓰면 바로 트러블 발생",
      "T존은 기름진데 볼은 민감해서 붉어지기 쉬움",
      "여드름 자국이 색소침착으로 오래 남고, 눈가 잔주름도 슬슬 보임"
    ],
    care: [
      "하나씩 천천히! 진정→유분 조절→미백→탄력 순서로 단계적 관리",
      "저자극 약산성 제품 사용",
      "과도한 각질 제거는 주 1회 이하로"
    ],
    products: ["저자극 약산성 젤 클렌저", "진정 밸런스 토너", "나이아신아마이드 세럼"],
    color: "from-blue-400 to-cyan-500",
    healthScore: 72
  },
  "OSPT": {
    type: "OSPT",
    title: "청순 윤광러",
    emoji: "✨",
    description: "20대의 탱탱함! 근데 왜 이렇게 예민하고 기름지고 잡티가 있는 거죠?",
    characteristics: [
      "탄력 하나는 자신 있지만 T존 기름과 싸우는 중",
      "화장품 바꿀 때마다 조마조마, 예민해서 쉽게 붉어짐",
      "여드름 자국, 잡티가 잘 생기고 오래 가는 편"
    ],
    care: [
      "진정이 최우선! 진정시킨 후 유분 조절",
      "꾸준한 미백 케어로 색소 예방",
      "순한 폼 클렌저 사용"
    ],
    products: ["순한 폼 클렌저 pH 5.5", "센텔라 진정 토너", "나이아신아마이드 3-5%"],
    color: "from-pink-400 to-rose-500",
    healthScore: 78
  },
  "OSNW": {
    type: "OSNW",
    title: "깨끗한 윤광러",
    emoji: "🌊",
    description: "피부톤은 깨끗한데 기름지고 예민하고 주름이 걱정...",
    characteristics: [
      "피부톤만큼은 균일하고 깨끗해서 칭찬받는 편",
      "하지만 T존 기름 + 민감성 + 눈가 주름이 고민",
      "30대 이상이거나 관리 안 하면 주름이 빨리 진행"
    ],
    care: [
      "피부톤은 이미 좋으니까 유분 조절+저자극 안티에이징에 집중",
      "저자극 젤 클렌저 사용",
      "레티놀은 저농도부터 시작"
    ],
    products: ["저자극 젤 클렌저", "진정 보습 토너", "펩타이드 아이크림"],
    color: "from-cyan-400 to-teal-500",
    healthScore: 75
  },
  "OSNT": {
    type: "OSNT",
    title: "완벽 청순",
    emoji: "🌸",
    description: "기름지고 예민한 거 빼면 완벽! 타고난 동안 피부",
    characteristics: [
      "잡티도 없고 주름도 없는 축복받은 피부",
      "단, T존 기름과 민감성만 관리하면 됨",
      "화장품 고를 때만 조심하면 완벽한 피부 유지 가능"
    ],
    care: [
      "심플하게 진정+유분 조절만 잘하면 끝",
      "저자극 약산성 클렌저",
      "가벼운 젤 크림 사용"
    ],
    products: ["저자극 약산성 클렌저", "진정 밸런스 토너", "가벼운 젤 크림"],
    color: "from-green-400 to-emerald-500",
    healthScore: 85
  },
  "ORPW": {
    type: "ORPW",
    title: "강철 유광러",
    emoji: "💪",
    description: "튼튼한데 기름지고, 잡티에 주름까지... 하지만 강하다!",
    characteristics: [
      "피부가 튼튼해서 웬만한 자극에 끄떡없음",
      "하지만 기름기 + 색소침착 + 주름이 동시 진행",
      "피부 장벽이 강해서 고농도 제품 사용 가능"
    ],
    care: [
      "튼튼하다고 방심하지 마세요!",
      "강력한 유분 조절 + 집중 미백 + 안티에이징",
      "고농도 활성 성분 사용 가능"
    ],
    products: ["딥클렌징 폼", "AHA/BHA 토너", "고농도 나이아신아마이드"],
    color: "from-orange-400 to-red-500",
    healthScore: 70
  },
  "ORPT": {
    type: "ORPT",
    title: "건강 유광러",
    emoji: "💎",
    description: "튼튼하고 탱탱한데 기름지고 잡티만 관리하면 완벽!",
    characteristics: [
      "피부 장벽 강하고 탄력도 좋은 건강한 피부",
      "T존 기름 + 색소침착만 고민",
      "20-30대 남성에게 흔한 타입"
    ],
    care: [
      "강한 세범 조절 + 미백 케어로 깨끗한 매끈 피부 완성",
      "딥클렌징 필수",
      "나이아신아마이드 + 비타민C"
    ],
    products: ["딥클렌징 폼", "유분 조절 토너", "비타민C 세럼"],
    color: "from-yellow-400 to-amber-500",
    healthScore: 82
  },
  "ORNW": {
    type: "ORNW",
    title: "매끈 유광러",
    emoji: "🌟",
    description: "톤 맑고 튼튼한데 기름지고 주름만 신경 쓰면 돼요",
    characteristics: [
      "깨끗한 피부톤과 강한 피부 장벽",
      "유분 조절과 탄력 관리만 필요",
      "기본 바탕이 훌륭한 피부"
    ],
    care: [
      "유분 조절하면서 탄력 관리에 집중",
      "레티놀 등 안티에이징 성분 적극 활용",
      "강력한 세정과 보습의 밸런스"
    ],
    products: ["딥클렌징", "레티놀 세럼", "펩타이드 크림"],
    color: "from-lime-400 to-green-500",
    healthScore: 80
  },
  "ORNT": {
    type: "ORNT",
    title: "완벽 유광러",
    emoji: "👑",
    description: "기름만 조절하면 완벽! 부러움의 대상 피부",
    characteristics: [
      "유분 빼고는 모든 것이 완벽한 피부",
      "튼튼하고 탱탱하고 깨끗한 피부톤",
      "가장 이상적인 피부 타입 중 하나"
    ],
    care: [
      "축복받은 피부! 심플한 세범 조절만 신경 쓰면 끝",
      "가벼운 수분 크림",
      "각질 관리로 모공 케어"
    ],
    products: ["딥클렌징 폼", "가벼운 수분 크림", "모공 케어 제품"],
    color: "from-emerald-400 to-teal-500",
    healthScore: 92
  },
  "DSPW": {
    type: "DSPW",
    title: "연약한 사막형",
    emoji: "🏜️",
    description: "건조하고 예민하고 잡티에 주름까지... 섬세한 관리가 필요해요",
    characteristics: [
      "네 가지 고민이 동시에 있는 극강 관리형",
      "건조해서 당기고, 예민해서 붉어지고, 색소 잘 생기고, 주름도 보임",
      "제품 선택이 가장 까다로운 타입"
    ],
    care: [
      "인내심이 필요해요! 진정→보습→미백→탄력 순으로 천천히 단계적 관리",
      "초저자극 제품 필수",
      "밀크/오일 클렌저 사용"
    ],
    products: ["초저자극 밀크 클렌저", "세라마이드 세럼", "리치 영양 크림"],
    color: "from-amber-400 to-orange-500",
    healthScore: 65
  },
  "DSPT": {
    type: "DSPT",
    title: "도자기 피부",
    emoji: "🎎",
    description: "예민하고 건조하고 잡티는 있지만 탱탱해서 동안!",
    characteristics: [
      "건조하고 민감하지만 탄력은 좋음",
      "색소침착 걱정은 있지만 주름은 없음",
      "젊은 나이의 민감 건성 피부"
    ],
    care: [
      "진정+보습이 최우선",
      "피부 장벽 강화 후 순한 미백 케어",
      "저자극 제품으로 단계적 관리"
    ],
    products: ["저자극 클렌저", "진정 고보습 토너", "세라마이드 크림"],
    color: "from-rose-400 to-pink-500",
    healthScore: 73
  },
  "DSNW": {
    type: "DSNW",
    title: "순백의 연약형",
    emoji: "🤍",
    description: "하얗고 깨끗한데 건조하고 예민하고 주름이...",
    characteristics: [
      "깨끗한 피부톤이지만 건조하고 민감",
      "주름과 탄력 저하 고민",
      "30대 이상 민감 건성 피부"
    ],
    care: [
      "보습+진정으로 피부 장벽 강화 후 저자극 안티에이징",
      "순한 영양 크림",
      "펩타이드 아이크림 필수"
    ],
    products: ["밀크 클렌저", "진정 고보습 토너", "펩타이드 크림"],
    color: "from-gray-300 to-gray-400",
    healthScore: 68
  },
  "DSNT": {
    type: "DSNT",
    title: "천사 피부",
    emoji: "😇",
    description: "건조하고 예민한 것만 빼면 완벽! 동안의 정석",
    characteristics: [
      "색소도 없고 주름도 없는 축복받은 피부",
      "단, 건조함과 민감성만 관리하면 됨",
      "가장 관리하기 쉬운 건성 타입"
    ],
    care: [
      "심플하게 진정+보습만! 이미 완벽한 피부를 망치지 않는 게 최고",
      "저자극 제품",
      "충분한 보습"
    ],
    products: ["저자극 클렌저", "진정 토너", "수분 크림"],
    color: "from-blue-200 to-indigo-300",
    healthScore: 88
  },
  "DRPW": {
    type: "DRPW",
    title: "강인한 사막형",
    emoji: "🏜️💪",
    description: "튼튼하지만 건조하고, 잡티에 주름도... 관리가 필요해요",
    characteristics: [
      "피부 장벽은 강하지만 건조하고 노화 진행",
      "색소침착과 주름 동시 관리 필요",
      "고농도 제품 사용 가능"
    ],
    care: [
      "강력한 보습 + 미백 + 안티에이징 동시 진행 가능",
      "고농도 활성 성분 OK",
      "레티놀, 비타민C 적극 활용"
    ],
    products: ["딥클렌징", "고농도 레티놀", "리치 크림"],
    color: "from-stone-400 to-amber-500",
    healthScore: 71
  },
  "DRPT": {
    type: "DRPT",
    title: "건강 매트형",
    emoji: "🌿",
    description: "튼튼하고 탱탱한데 건조하고 잡티만 관리하면 완벽!",
    characteristics: [
      "튼튼하고 탄력 있는 건강한 피부",
      "건조함과 색소침착만 고민",
      "20-30대 건성 피부"
    ],
    care: [
      "보습 + 미백 집중! 튼튼하고 탱탱한 건 타고났어요",
      "충분한 수분 공급",
      "비타민C로 미백 케어"
    ],
    products: ["순한 클렌저", "보습 토너", "비타민C 세럼"],
    color: "from-green-400 to-lime-500",
    healthScore: 79
  },
  "DRNW": {
    type: "DRNW",
    title: "맑은 매트형",
    emoji: "☁️",
    description: "톤 맑고 튼튼한데 건조하고 주름만 신경 쓰면 돼요",
    characteristics: [
      "깨끗한 피부톤과 강한 피부 장벽",
      "건조함과 탄력 관리 필요",
      "기본이 훌륭한 건성 피부"
    ],
    care: [
      "보습 + 탄력 관리에 집중! 수분 충전이 핵심",
      "레티놀 등 안티에이징 적극 활용",
      "충분한 보습"
    ],
    products: ["보습 클렌저", "고보습 토너", "레티놀 크림"],
    color: "from-sky-300 to-blue-400",
    healthScore: 76
  },
  "DRNT": {
    type: "DRNT",
    title: "완벽 매트형",
    emoji: "👼",
    description: "수분만 충분히 주면 완벽! 이상형 피부",
    characteristics: [
      "건조함 빼고는 모든 것이 완벽",
      "튼튼하고 탱탱하고 깨끗한 피부톤",
      "가장 이상적인 건성 피부"
    ],
    care: [
      "축복받은 피부! 심플하게 보습만 꾸준히",
      "수분 크림 충분히",
      "히알루론산 제품 활용"
    ],
    products: ["보습 클렌저", "히알루론산 세럼", "수분 크림"],
    color: "from-indigo-400 to-purple-500",
    healthScore: 90
  }
};

// 채팅봇 컴포넌트
function Chatbot({ skinType, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `안녕하세요! 😊\n\n당신의 피부 타입은 **${skinType.type} (${skinType.title})** 입니다.\n\n피부 특징:\n${skinType.characteristics.map(c => `• ${c}`).join('\n')}\n\n이런 피부 타입에 맞는 제품들을 추천해드릴게요. 궁금하신 제품이나 고민이 있으시면 편하게 물어보세요! 💝`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `당신은 피부 관리 전문가이자 제품 추천 전문가입니다. 사용자의 피부 타입은 ${skinType.type} (${skinType.title})입니다. 
              
특징: ${skinType.characteristics.join(', ')}
관리 방법: ${skinType.care.join(', ')}
추천 제품: ${skinType.products.join(', ')}

사용자의 피부 타입에 맞는 구체적인 제품을 추천해주세요. 제품명, 브랜드, 주요 성분, 사용법을 포함하여 상세하게 설명해주세요. 가격대도 언급해주면 좋습니다. 답변은 친절하고 전문적으로, 2-4문장으로 해주세요.`
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const assistantMessage = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '죄송합니다. 일시적인 오류가 발생했습니다. API 키를 확인해주세요. 🙏' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative">
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-white">
                AI
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">내 피부에 맞는 제품 추천</h3>
              <p className="text-xs text-gray-500">{skinType.type} 맞춤 추천</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="어떤 제품이 궁금하신가요?"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-purple-500 transition-colors"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            💡 토너, 세럼, 크림 등 제품 카테고리별 추천을 받아보세요
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SkinMBTITest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showStart, setShowStart] = useState(true);
  const [selectedScore, setSelectedScore] = useState(null);
  const [showPercentages, setShowPercentages] = useState(true); // 기본값을 true로 변경
  const [percentages, setPercentages] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('analysis');
  const [diaryEntries, setDiaryEntries] = useState([
    { date: '2025.10.30', condition: '좋음', note: '새 토너 사용, 피부 촉촉', emoji: '😊' },
    { date: '2025.10.29', condition: '보통', note: '약간 건조한 느낌', emoji: '😐' },
    { date: '2025.10.28', condition: '나쁨', note: '트러블 발생', emoji: '😰' }
  ]);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [newDiaryEntry, setNewDiaryEntry] = useState({
    condition: '좋음',
    note: '',
    emoji: '😊'
  });
  const [showProductModal, setShowProductModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // 카카오 SDK 초기화
  useEffect(() => {
    initKakao();
  }, []);

  const handleScoreSelect = (score) => {
    const newAnswers = { ...answers, [currentQuestion]: score };
    setAnswers(newAnswers);
    setSelectedScore(score);
  };

  const handleAddDiaryEntry = () => {
    if (!newDiaryEntry.note.trim()) {
      alert('메모를 입력해주세요!');
      return;
    }

    const today = new Date();
    const dateString = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    
    const entry = {
      date: dateString,
      condition: newDiaryEntry.condition,
      note: newDiaryEntry.note,
      emoji: newDiaryEntry.emoji
    };

    setDiaryEntries([entry, ...diaryEntries]);
    setShowDiaryModal(false);
    setNewDiaryEntry({
      condition: '좋음',
      note: '',
      emoji: '😊'
    });
  };

  const handleConditionChange = (condition) => {
    let emoji = '😊';
    if (condition === '보통') emoji = '😐';
    if (condition === '나쁨') emoji = '😰';
    
    setNewDiaryEntry({
      ...newDiaryEntry,
      condition,
      emoji
    });
  };

  // 네이버 쇼핑 검색 링크 생성 및 이동
  const goToNaverShopping = () => {
    const product = getRecommendedProduct();
    if (product && product.searchQuery) {
      const searchUrl = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(product.searchQuery)}`;
      window.open(searchUrl, '_blank');
    }
  };

  // SNS 공유 기능
  const shareToKakao = () => {
    const shareUrl = window.location.href;
    const shareTitle = `나의 피부 타입: ${result.type} - ${result.title}`;
    const shareDescription = result.description;
    
    // 카카오톡 공유
    if (window.Kakao && window.Kakao.isInitialized()) {
      try {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: shareTitle,
            description: shareDescription,
            imageUrl: 'https://localhost:3000/images/skin-share.png', // 실제 이미지 URL로 교체 필요
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: '나도 테스트하기',
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        });
        setShowShareModal(false);
      } catch (error) {
        console.error('카카오톡 공유 실패:', error);
        alert('카카오톡 공유에 실패했습니다. 링크를 복사해서 공유해주세요.');
        copyToClipboard();
      }
    } else {
      alert('카카오톡 공유 기능을 사용할 수 없습니다.\n링크를 복사해서 공유해주세요.');
      copyToClipboard();
    }
  };

  const shareToFacebook = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const shareToInstagram = () => {
    // Instagram은 직접 공유 API가 없어서 URL 복사
    copyToClipboard();
    setShowShareModal(false);
    alert('링크가 복사되었습니다!\n인스타그램 스토리나 게시물에 붙여넣어 공유해주세요 📸');
  };

  const copyToClipboard = () => {
    const shareUrl = window.location.href;
    const shareText = `나의 피부 타입은 ${result.type} - ${result.title}!\n${result.description}\n\n${shareUrl}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setShowShareModal(false);
        alert('링크가 클립보드에 복사되었습니다! 📋');
      });
    } else {
      // 구형 브라우저 대응
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setShowShareModal(false);
      alert('링크가 클립보드에 복사되었습니다! 📋');
    }
  };

  // 피부 타입별 추천 제품 상세 정보
  const getRecommendedProduct = () => {
    if (!result) return null;

    // 피부 타입에 따른 맞춤 제품 추천
    const productRecommendations = {
      // 지성 피부 타입들
      'OSPW': {
        name: '나이아신아마이드 진정 세럼',
        category: '세럼/앰플',
        price: '35,000원',
        volume: '30ml',
        searchQuery: '나이아신아마이드 진정 세럼',
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        mainIngredients: ['나이아신아마이드 5%', '센텔라 아시아티카', '판테놀', '히알루론산'],
        benefits: [
          '과잉 피지 분비 조절',
          '민감한 피부 진정 효과',
          '색소 침착 완화 및 미백',
          '피부 장벽 강화'
        ],
        usage: '토너 후 적당량을 펴 발라주세요. 아침/저녁 사용 가능.',
        caution: '처음 사용 시 팔 안쪽에 패치 테스트를 권장합니다.'
      },
      'OSPT': {
        name: '티트리 밸런싱 토너',
        category: '토너/스킨',
        price: '28,000원',
        volume: '200ml',
        searchQuery: '티트리 밸런싱 토너',
        imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
        mainIngredients: ['티트리 추출물 10%', '나이아신아마이드 3%', '살리실산', 'BHA'],
        benefits: [
          '피지 과다 분비 조절',
          '모공 케어 및 피부결 개선',
          '잡티 및 색소 침착 완화',
          '피부 진정 및 트러블 케어'
        ],
        usage: '세안 후 화장솜 또는 손으로 얼굴 전체에 펴 발라주세요.',
        caution: '각질 제거 성분이 포함되어 있어 저녁 사용을 권장합니다.'
      },
      'OSNW': {
        name: '레티놀 안티에이징 크림',
        category: '크림',
        price: '42,000원',
        volume: '50ml',
        searchQuery: '레티놀 안티에이징 크림',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        mainIngredients: ['레티놀 0.1%', '펩타이드 복합체', '세라마이드', '스쿠알란'],
        benefits: [
          '주름 개선 및 탄력 증진',
          '피지 조절 및 모공 케어',
          '피부 재생 촉진',
          '민감 피부도 사용 가능한 순한 처방'
        ],
        usage: '저녁 스킨케어 마지막 단계에서 사용하세요. 소량부터 시작하세요.',
        caution: '레티놀 사용 시 자외선 차단제를 필수로 사용하세요.'
      },
      'OSNT': {
        name: '그린티 수분 젤 크림',
        category: '크림',
        price: '26,000원',
        volume: '80ml',
        searchQuery: '그린티 수분 젤 크림',
        imageUrl: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
        mainIngredients: ['녹차 추출물 70%', '히알루론산', '병풀 추출물', '알란토인'],
        benefits: [
          '가볍고 산뜻한 수분 공급',
          '피지 조절 및 쿨링 효과',
          '민감 피부 진정',
          '끈적임 없는 마무리감'
        ],
        usage: '아침/저녁 스킨케어 마지막 단계에서 적당량을 발라주세요.',
        caution: '냉장 보관 시 더욱 시원한 쿨링감을 느낄 수 있습니다.'
      },
      // 지성+저항성 피부
      'ORPW': {
        name: '비타민C 브라이트닝 세럼',
        category: '세럼/앰플',
        price: '45,000원',
        volume: '30ml',
        searchQuery: '비타민C 브라이트닝 세럼',
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        mainIngredients: ['순수 비타민C 15%', '비타민E', '페룰릭애씨드', '레티놀'],
        benefits: [
          '강력한 미백 및 브라이트닝',
          '안티에이징 및 주름 개선',
          '피지 조절',
          '항산화 효과'
        ],
        usage: '아침 세안 후 토너 다음 단계에서 사용하세요.',
        caution: '비타민C는 산화되기 쉬우니 서늘한 곳에 보관하세요.'
      },
      'ORPT': {
        name: 'AHA/BHA 각질 케어 토너',
        category: '토너/스킨',
        price: '32,000원',
        volume: '150ml',
        searchQuery: 'AHA BHA 각질 케어 토너',
        imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
        mainIngredients: ['AHA 4%', 'BHA 1%', '나이아신아마이드', '위치하젤'],
        benefits: [
          '각질 제거 및 피부결 개선',
          '모공 속 노폐물 제거',
          '색소 침착 완화',
          '피부 톤 균일화'
        ],
        usage: '저녁 세안 후 화장솜에 적셔 닦아내듯 사용하세요. 주 2-3회 권장.',
        caution: '각질 제거 제품이므로 자외선 차단제 필수 사용.'
      },
      'ORNW': {
        name: '펩타이드 리프팅 세럼',
        category: '세럼/앰플',
        price: '48,000원',
        volume: '40ml',
        searchQuery: '펩타이드 리프팅 세럼',
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        mainIngredients: ['6가지 펩타이드 복합체', '아데노신', '레티놀', '콜라겐'],
        benefits: [
          '탄력 개선 및 리프팅',
          '주름 완화',
          '피부 재생',
          '처짐 개선'
        ],
        usage: '토너 후 얼굴 전체 또는 주름 부위에 집중 사용하세요.',
        caution: '아침/저녁 모두 사용 가능하며, 꾸준한 사용이 중요합니다.'
      },
      'ORNT': {
        name: '히알루론산 수분 세럼',
        category: '세럼/앰플',
        price: '29,000원',
        volume: '50ml',
        searchQuery: '히알루론산 수분 세럼',
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        mainIngredients: ['저분자 히알루론산', '고분자 히알루론산', '판테놀', '베타글루칸'],
        benefits: [
          '깊은 수분 공급',
          '유수분 밸런스 조절',
          '피부 장벽 강화',
          '촉촉한 피부 유지'
        ],
        usage: '토너 후 2-3방울을 얼굴 전체에 펴 발라주세요.',
        caution: '모든 피부 타입에 자극 없이 사용 가능합니다.'
      },
      // 건성 피부 타입들
      'DSPW': {
        name: '세라마이드 리페어 크림',
        category: '크림',
        price: '38,000원',
        volume: '50ml',
        searchQuery: '세라마이드 리페어 크림',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        mainIngredients: ['세라마이드 5종', '콜레스테롤', '지방산', '판테놀', '센텔라'],
        benefits: [
          '손상된 피부 장벽 회복',
          '깊은 보습 및 영양 공급',
          '민감 피부 진정',
          '색소 침착 완화 도움'
        ],
        usage: '아침/저녁 스킨케어 마지막 단계에서 충분히 발라주세요.',
        caution: '극건성 피부는 2-3번 중복 도포를 권장합니다.'
      },
      'DSPT': {
        name: '진정 보습 앰플',
        category: '세럼/앰플',
        price: '34,000원',
        volume: '30ml',
        searchQuery: '진정 보습 앰플',
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        mainIngredients: ['센텔라 아시아티카 80%', '마데카소사이드', '히알루론산', '판테놀'],
        benefits: [
          '예민한 피부 즉각 진정',
          '깊은 수분 공급',
          '피부 장벽 강화',
          '자극 완화'
        ],
        usage: '토너 후 2-3방울을 얼굴 전체에 부드럽게 펴 발라주세요.',
        caution: '냉장 보관 시 진정 효과가 더욱 좋습니다.'
      },
      'DSNW': {
        name: '펩타이드 영양 크림',
        category: '크림',
        price: '44,000원',
        volume: '50ml',
        searchQuery: '펩타이드 영양 크림',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        mainIngredients: ['펩타이드 7종', '레티놀', '세라마이드', '시어버터'],
        benefits: [
          '주름 개선 및 탄력 증진',
          '건조 완화 및 보습',
          '민감 피부 진정',
          '피부 재생'
        ],
        usage: '저녁 스킨케어 마지막 단계에서 충분히 발라주세요.',
        caution: '건조한 부위에 중점적으로 덧발라주세요.'
      },
      'DSNT': {
        name: '히아루론산 수분 크림',
        category: '크림',
        price: '31,000원',
        volume: '80ml',
        searchQuery: '히알루론산 수분 크림',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        mainIngredients: ['히알루론산 3중 복합체', '베타글루칸', '알로에', '병풀'],
        benefits: [
          '24시간 수분 유지',
          '피부 장벽 보호',
          '민감 피부 진정',
          '촉촉한 마무리'
        ],
        usage: '아침/저녁 스킨케어 마지막 단계에서 발라주세요.',
        caution: '모든 계절, 모든 피부 타입에 사용 가능합니다.'
      },
      'DRPW': {
        name: '고영양 안티에이징 크림',
        category: '크림',
        price: '52,000원',
        volume: '50ml',
        searchQuery: '고영양 안티에이징 크림',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        mainIngredients: ['레티놀 0.3%', '펩타이드 복합체', '비타민C', '세라마이드', '시어버터'],
        benefits: [
          '강력한 주름 개선',
          '깊은 영양 공급',
          '색소 침착 완화',
          '탄력 증진'
        ],
        usage: '저녁 스킨케어 마지막 단계에서 충분히 발라주세요.',
        caution: '레티놀 고농도 제품으로 소량부터 시작하세요.'
      },
      'DRPT': {
        name: '비타민 브라이트닝 크림',
        category: '크림',
        price: '39,000원',
        volume: '50ml',
        searchQuery: '비타민 브라이트닝 크림',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        mainIngredients: ['비타민C 유도체', '나이아신아마이드', '알부틴', '히알루론산'],
        benefits: [
          '피부 톤 개선',
          '색소 침착 완화',
          '보습 및 영양',
          '투명한 피부결'
        ],
        usage: '아침/저녁 스킨케어 마지막 단계에서 발라주세요.',
        caution: '비타민 성분이므로 자외선 차단제와 함께 사용하세요.'
      },
      'DRNW': {
        name: '레티놀 리페어 나이트 크림',
        category: '크림',
        price: '46,000원',
        volume: '50ml',
        searchQuery: '레티놀 리페어 나이트 크림',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        mainIngredients: ['레티놀 0.2%', '펩타이드', '세라마이드', '스쿠알란'],
        benefits: [
          '야간 집중 안티에이징',
          '주름 개선',
          '깊은 보습',
          '피부 재생'
        ],
        usage: '저녁 스킨케어 마지막 단계에서만 사용하세요.',
        caution: '레티놀 제품으로 아침에는 자외선 차단제 필수입니다.'
      },
      'DRNT': {
        name: '딥 모이스처 하이드레이팅 크림',
        category: '크림',
        price: '33,000원',
        volume: '100ml',
        searchQuery: '딥 모이스처 하이드레이팅 크림',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        mainIngredients: ['히알루론산', '세라마이드', '스쿠알란', '시어버터'],
        benefits: [
          '장시간 깊은 보습',
          '건조 완화',
          '피부 장벽 강화',
          '매끄러운 피부결'
        ],
        usage: '아침/저녁 스킨케어 마지막 단계에서 충분히 발라주세요.',
        caution: '대용량으로 얼굴뿐 아니라 몸에도 사용 가능합니다.'
      }
    };

    return productRecommendations[result.type] || productRecommendations['ORNT'];
  };

  const handleNext = () => {
    if (selectedScore === null) return;
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedScore(answers[currentQuestion + 1] || null);
    } else {
      calculateResult(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedScore(answers[currentQuestion - 1] || null);
    }
  };

  const calculateResult = (finalAnswers) => {
    let oilyScore = 0, dryScore = 0;
    let sensitiveScore = 0;
    let pigmentedScore = 0;
    let wrinkledScore = 0;

    questions.forEach((q, index) => {
      const score = finalAnswers[index] || 3;
      
      if (q.category === 'OD') {
        if (q.type === 'O') oilyScore += score;
        if (q.type === 'D') dryScore += score;
      } else if (q.category === 'SR') {
        sensitiveScore += score;
      } else if (q.category === 'PN') {
        pigmentedScore += score;
      } else if (q.category === 'WT') {
        wrinkledScore += score;
      }
    });

    const resistantScore = 60 - sensitiveScore;
    const nonPigmentedScore = 60 - pigmentedScore;
    const tightScore = 60 - wrinkledScore;

    const oilyPercent = Math.round((oilyScore / (oilyScore + dryScore)) * 100);
    const dryPercent = 100 - oilyPercent;
    
    const sensitivePercent = Math.round((sensitiveScore / (sensitiveScore + resistantScore)) * 100);
    const resistantPercent = 100 - sensitivePercent;
    
    const pigmentedPercent = Math.round((pigmentedScore / (pigmentedScore + nonPigmentedScore)) * 100);
    const nonPigmentedPercent = 100 - pigmentedPercent;
    
    const wrinkledPercent = Math.round((wrinkledScore / (wrinkledScore + tightScore)) * 100);
    const tightPercent = 100 - wrinkledPercent;

    let skinType = '';
    skinType += oilyPercent >= 50 ? 'O' : 'D';
    skinType += sensitivePercent >= 50 ? 'S' : 'R';
    skinType += pigmentedPercent >= 50 ? 'P' : 'N';
    skinType += wrinkledPercent >= 50 ? 'W' : 'T';

    setPercentages({
      oily: oilyPercent,
      dry: dryPercent,
      sensitive: sensitivePercent,
      resistant: resistantPercent,
      pigmented: pigmentedPercent,
      nonPigmented: nonPigmentedPercent,
      wrinkled: wrinkledPercent,
      tight: tightPercent
    });

    const matchedResult = skinTypes[skinType] || skinTypes['ORNT'];
    setResult(matchedResult);
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setShowStart(true);
    setSelectedScore(null);
    setShowPercentages(false);
    setPercentages(null);
    setShowChatbot(false);
    setSelectedFeature('analysis');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const canGoNext = selectedScore !== null;

  // 시작 화면
  if (showStart) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-xl w-full text-center px-6 py-12">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            내 피부 MBTI<br/>
            알아보기
          </h1>
          
          <p className="text-lg text-gray-500 mb-4">
            내피셜 - 피부 컨디션 진단
          </p>
          
          <p className="text-sm text-gray-400 mb-12">
            40가지 질문으로 정확한 피부 타입 진단
          </p>

          <button
            onClick={() => setShowStart(false)}
            className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            테스트 "바로" 시작하기
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-8 text-sm text-gray-400">
            현재 총 <span className="font-semibold text-gray-600">3,387</span>명이 참여했습니다.
          </p>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (result) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* 결과 헤더 */}
          <div className={`bg-gradient-to-r ${result.color} text-white py-16 px-4`}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🎉 분석 완료!
              </div>
              <div className="text-7xl mb-6">{result.emoji}</div>
              <div className="bg-white/30 backdrop-blur-lg inline-block px-6 py-2 rounded-full font-bold text-xl mb-4">
                {result.type}
              </div>
              <h1 className="text-4xl font-bold mb-3">{result.title}</h1>
              <p className="text-white/90 text-lg mb-6">
                {result.description}
              </p>
              
              <div className="flex justify-center gap-3 flex-wrap">
                <button 
                  onClick={() => setShowChatbot(true)}
                  className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2"
                >
                  <div className="relative">
                    <MessageCircle className="w-7 h-7" />
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold">
                      AI
                    </span>
                  </div>
                  내 피부에 맞는 제품 추천
                </button>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition border border-white/30"
                >
                  공유하기
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 -mt-8">
            {/* 기능 탭 */}
            <div className="bg-white rounded-2xl shadow-xl p-2 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'analysis', label: '상세 분석', icon: BarChart3 },
                  { id: 'diary', label: '피부 일기', icon: Calendar },
                  { id: 'routine', label: '맞춤 루틴', icon: Target },
                  { id: 'tracking', label: '피부 기록 캘린더', icon: CalendarHeartIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFeature(tab.id)}
                    className={`py-3 px-4 rounded-xl font-semibold text-sm transition ${
                      selectedFeature === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`grid ${selectedFeature === 'analysis' ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-6 pb-8`}>
              {/* 메인 컨텐츠 */}
              <div className={`${selectedFeature === 'analysis' ? 'md:col-span-2' : ''} space-y-6`}>
                {/* 상세 분석 탭 */}
                {selectedFeature === 'analysis' && (
                  <>
                    {/* 퍼센트 분석 */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <button
                        onClick={() => setShowPercentages(!showPercentages)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-purple-500" />
                          <span className="font-semibold text-gray-900">피부 특성 비율</span>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showPercentages ? 'rotate-90' : ''}`} />
                      </button>

                      {showPercentages && percentages && (
                        <div className="mt-6 space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className={percentages.oily >= 50 ? 'font-bold text-gray-900' : 'text-gray-500'}>
                                지성 {percentages.oily}%
                              </span>
                              <span className={percentages.dry > 50 ? 'font-bold text-gray-900' : 'text-gray-500'}>
                                건성 {percentages.dry}%
                              </span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                              <div className="bg-gradient-to-r from-blue-400 to-cyan-500" style={{ width: `${percentages.oily}%` }} />
                              <div className="bg-gradient-to-r from-amber-300 to-orange-400" style={{ width: `${percentages.dry}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className={percentages.sensitive >= 50 ? 'font-bold text-gray-900' : 'text-gray-500'}>
                                민감성 {percentages.sensitive}%
                              </span>
                              <span className={percentages.resistant > 50 ? 'font-bold text-gray-900' : 'text-gray-500'}>
                                저항성 {percentages.resistant}%
                              </span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                              <div className="bg-gradient-to-r from-pink-400 to-rose-500" style={{ width: `${percentages.sensitive}%` }} />
                              <div className="bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${percentages.resistant}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className={percentages.pigmented >= 50 ? 'font-bold text-gray-900' : 'text-gray-500'}>
                                색소성 {percentages.pigmented}%
                              </span>
                              <span className={percentages.nonPigmented > 50 ? 'font-bold text-gray-900' : 'text-gray-500'}>
                                비색소성 {percentages.nonPigmented}%
                              </span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                              <div className="bg-gradient-to-r from-yellow-400 to-amber-500" style={{ width: `${percentages.pigmented}%` }} />
                              <div className="bg-gradient-to-r from-indigo-400 to-purple-500" style={{ width: `${percentages.nonPigmented}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className={percentages.wrinkled >= 50 ? 'font-bold text-gray-900' : 'text-gray-500'}>
                                주름 {percentages.wrinkled}%
                              </span>
                              <span className={percentages.tight > 50 ? 'font-bold text-gray-900' : 'text-gray-500'}>
                                탱탱함 {percentages.tight}%
                              </span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                              <div className="bg-gradient-to-r from-gray-400 to-gray-500" style={{ width: `${percentages.wrinkled}%` }} />
                              <div className="bg-gradient-to-r from-pink-300 to-rose-400" style={{ width: `${percentages.tight}%` }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 피부 특징 */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        피부 특징
                      </h3>
                      <ul className="space-y-2 ml-8">
                        {result.characteristics.map((char, index) => (
                          <li key={index} className="text-gray-600 text-sm leading-relaxed">
                            • {char}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 케어 포인트 */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-purple-600" />
                        </div>
                        케어 포인트
                      </h3>
                      <ul className="space-y-2 ml-8">
                        {result.care.map((item, index) => (
                          <li key={index} className="text-gray-600 text-sm leading-relaxed">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 추천 제품 */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-pink-600" />
                        </div>
                        추천 제품
                      </h3>
                      <div className="flex flex-wrap gap-2 ml-8">
                        {result.products.map((product, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gray-50 rounded-full text-xs text-gray-700 font-medium"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* 피부 일기 탭 */}
                {selectedFeature === 'diary' && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">📔 피부 일기</h3>
                    
                    <div className="space-y-4">
                      {diaryEntries.map((entry, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4 flex items-start gap-4">
                          <div className="text-3xl">{entry.emoji}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-gray-900">{entry.date}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                entry.condition === '좋음' ? 'bg-green-100 text-green-700' :
                                entry.condition === '보통' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {entry.condition}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{entry.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setShowDiaryModal(true)}
                      className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      + 오늘의 기록 추가
                    </button>
                  </div>
                )}

                {/* 맞춤 루틴 탭 */}
                {selectedFeature === 'routine' && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">🎯 맞춤 루틴</h3>
                    
                    {['아침 루틴', '저녁 루틴'].map((title, idx) => (
                      <div key={idx} className="mb-6">
                        <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                          {idx === 0 ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-purple-500" />}
                          {title}
                        </h4>
                        <div className="space-y-2">
                          {['클렌징', '토너', '에센스', '크림', idx === 0 ? '선크림' : '수면팩'].map((step, stepIdx) => (
                            step && (
                              <div key={stepIdx} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {stepIdx + 1}
                                </div>
                                <span className="text-gray-900">{step}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 변화 추적 탭 - 캘린더 기반 */}
                {selectedFeature === 'tracking' && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">📅 피부 기록 캘린더</h3>
                    
                    {/* 캘린더 헤더 */}
                    <div className="mb-6">
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-bold text-gray-900">2025년 10월</h4>
                      </div>
                      
                      {/* 요일 헤더 */}
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                          <div key={idx} className="text-center text-sm font-semibold text-gray-500 py-2">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* 캘린더 날짜 */}
                      <div className="grid grid-cols-7 gap-2">
                        {(() => {
                          const calendar = [];
                          // 10월 1일이 화요일이라고 가정
                          const startDay = 2; // 0=일, 1=월, 2=화
                          const daysInMonth = 31;
                          
                          // 빈 칸 추가 (월초 이전)
                          for (let i = 0; i < startDay; i++) {
                            calendar.push(
                              <div key={`empty-${i}`} className="aspect-square"></div>
                            );
                          }
                          
                          // 날짜 추가
                          for (let day = 1; day <= daysInMonth; day++) {
                            const dateStr = `2025.10.${String(day).padStart(2, '0')}`;
                            const entry = diaryEntries.find(e => e.date === dateStr);
                            
                            calendar.push(
                              <div
                                key={day}
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                                  entry
                                    ? entry.condition === '좋음'
                                      ? 'bg-green-100 border-2 border-green-500'
                                      : entry.condition === '보통'
                                      ? 'bg-yellow-100 border-2 border-yellow-500'
                                      : 'bg-red-100 border-2 border-red-500'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                                <span className={`font-semibold ${
                                  entry ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                  {day}
                                </span>
                                {entry && (
                                  <span className="text-lg mt-1">{entry.emoji}</span>
                                )}
                              </div>
                            );
                          }
                          
                          return calendar;
                        })()}
                      </div>
                    </div>

                    {/* 범례 */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">피부 상태 범례</h5>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-500"></div>
                          <span className="text-sm text-gray-700">😊 좋음</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-yellow-100 border-2 border-yellow-500"></div>
                          <span className="text-sm text-gray-700">😐 보통</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-500"></div>
                          <span className="text-sm text-gray-700">😰 나쁨</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-gray-50"></div>
                          <span className="text-sm text-gray-700">기록 없음</span>
                        </div>
                      </div>
                    </div>

                    {/* 통계 요약 */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {diaryEntries.filter(e => e.condition === '좋음').length}일
                        </div>
                        <div className="text-sm text-gray-600 mt-1">좋은 날</div>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {diaryEntries.filter(e => e.condition === '보통').length}일
                        </div>
                        <div className="text-sm text-gray-600 mt-1">보통 날</div>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {diaryEntries.filter(e => e.condition === '나쁨').length}일
                        </div>
                        <div className="text-sm text-gray-600 mt-1">안 좋은 날</div>
                      </div>
                    </div>

                    {/* 최근 기록 */}
                    {diaryEntries.length > 0 && (
                      <div className="mt-6">
                        <h5 className="text-sm font-semibold text-gray-900 mb-3">최근 기록</h5>
                        <div className="space-y-2">
                          {diaryEntries.slice(0, 3).map((entry, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                              <div className="text-2xl">{entry.emoji}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-900">{entry.date}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    entry.condition === '좋음' ? 'bg-green-100 text-green-700' :
                                    entry.condition === '보통' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {entry.condition}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{entry.note}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 사이드바 - 상세 분석 탭에서만 표시 */}
              {selectedFeature === 'analysis' && (
                <div className="space-y-6">
                  {/* 피부 점수 */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h4 className="font-semibold mb-4 text-gray-900">종합 피부 점수</h4>
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                        {result.healthScore}
                      </div>
                      <p className="text-sm text-gray-500">상위 15%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{width: `${result.healthScore}%`}}></div>
                    </div>
                  </div>

                  {/* 추천 제품 */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h4 className="font-semibold mb-4 text-gray-900">오늘의 추천</h4>
                    <div className="bg-gray-50 rounded-xl p-4 mb-3">
                      <div className="w-full h-48 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={getRecommendedProduct()?.imageUrl} 
                          alt={getRecommendedProduct()?.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400/E5E7EB/9CA3AF?text=Product+Image';
                          }}
                        />
                      </div>
                      <h5 className="font-semibold mb-1 text-gray-900">{getRecommendedProduct()?.name}</h5>
                      <p className="text-xs text-gray-600 mb-2">{getRecommendedProduct()?.category}</p>
                      <button 
                        onClick={() => setShowProductModal(true)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        자세히 보기
                      </button>
                    </div>
                  </div>

                  {/* 다음 목표 */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h4 className="font-semibold mb-4 text-gray-900">🎯 다음 목표</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-900">7일 연속 기록</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        <span className="text-sm text-gray-600">한 달 루틴 완성</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 다시하기 버튼 */}
            <div className="pb-8">
              <button
                onClick={restartTest}
                className="w-full bg-white text-gray-700 py-4 rounded-2xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                🔄 다시 테스트하기
              </button>
            </div>
          </div>
        </div>

        {/* 공유하기 모달 */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">결과 공유하기</h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* 공유 미리보기 */}
                <div className={`bg-gradient-to-r ${result.color} rounded-2xl p-6 text-white text-center mb-6`}>
                  <div className="text-5xl mb-3">{result.emoji}</div>
                  <div className="text-sm opacity-90 mb-1">{result.type}</div>
                  <div className="text-xl font-bold mb-2">{result.title}</div>
                  <div className="text-sm opacity-80">{result.description}</div>
                </div>

                {/* SNS 공유 버튼들 */}
                <div className="space-y-3">
                  {/* 카카오톡 */}
                  <button
                    onClick={shareToKakao}
                    className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-gray-900 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3C6.486 3 2 6.382 2 10.5c0 2.442 1.529 4.596 3.904 5.964-.16.613-.522 2.032-.601 2.36-.096.397.145.391.304.284.126-.084 2.031-1.364 2.884-1.935.767.135 1.56.205 2.509.205 5.514 0 10-3.382 10-7.5S17.514 3 12 3z"/>
                    </svg>
                    카카오톡으로 공유
                  </button>

                  {/* 페이스북 */}
                  <button
                    onClick={shareToFacebook}
                    className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    페이스북으로 공유
                  </button>

                  {/* 인스타그램 */}
                  <button
                    onClick={shareToInstagram}
                    className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    인스타그램으로 공유
                  </button>

                  {/* 링크 복사 */}
                  <button
                    onClick={copyToClipboard}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    링크 복사
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  💡 친구들에게도 테스트를 추천해보세요!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 제품 상세 정보 모달 */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">제품 상세 정보</h3>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* 제품 이미지 */}
				<div className="w-full h-64 rounded-2xl overflow-hidden bg-gray-100">
				  <img
				    src={getRecommendedProduct()?.imageUrl}
				    alt={getRecommendedProduct()?.name}
				    className="w-full h-full object-cover"
				    onError={(e) => {
				      e.currentTarget.src = 'https://via.placeholder.com/800x400/E5E7EB/9CA3AF?text=No+Image';
				    }}
				  />
				</div>

                {/* 제품 기본 정보 */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-1">
                        {getRecommendedProduct()?.name}
                      </h4>
                      <p className="text-sm text-gray-500">{getRecommendedProduct()?.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{getRecommendedProduct()?.price}</div>
                      <div className="text-sm text-gray-500">{getRecommendedProduct()?.volume}</div>
                    </div>
                  </div>
                  <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold mt-2">
                    {result.type} 타입 맞춤 추천
                  </div>
                </div>

                {/* 주요 성분 */}
                <div className="bg-purple-50 rounded-2xl p-5">
                  <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-purple-600" />
                    주요 성분
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {getRecommendedProduct()?.mainIngredients.map((ingredient, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 효능 */}
                <div>
                  <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    이런 효과가 있어요
                  </h5>
                  <ul className="space-y-2">
                    {getRecommendedProduct()?.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 사용 방법 */}
                <div className="bg-blue-50 rounded-2xl p-5">
                  <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    사용 방법
                  </h5>
                  <p className="text-gray-700 leading-relaxed">{getRecommendedProduct()?.usage}</p>
                </div>

                {/* 주의사항 */}
                <div className="bg-yellow-50 rounded-2xl p-5">
                  <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    주의사항
                  </h5>
                  <p className="text-gray-700 leading-relaxed">{getRecommendedProduct()?.caution}</p>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-3">
                  <button 
                    onClick={goToNaverShopping}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    🛒 구매하러 가기
                  </button>
                  <button 
                    onClick={() => setShowProductModal(false)}
                    className="px-6 py-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 피부 일기 추가 모달 */}
        {showDiaryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">📝 오늘의 피부 기록</h3>
                  <button
                    onClick={() => {
                      setShowDiaryModal(false);
                      setNewDiaryEntry({
                        condition: '좋음',
                        note: '',
                        emoji: '😊'
                      });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* 피부 상태 선택 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    오늘 피부 상태는 어떠신가요?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: '좋음', emoji: '😊', color: 'green' },
                      { value: '보통', emoji: '😐', color: 'yellow' },
                      { value: '나쁨', emoji: '😰', color: 'red' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleConditionChange(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          newDiaryEntry.condition === option.value
                            ? `border-${option.color}-500 bg-${option.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{option.emoji}</div>
                        <div className={`text-sm font-semibold ${
                          newDiaryEntry.condition === option.value
                            ? `text-${option.color}-700`
                            : 'text-gray-600'
                        }`}>
                          {option.value}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 메모 입력 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    오늘의 피부 메모 ✍️
                  </label>
                  <textarea
                    value={newDiaryEntry.note}
                    onChange={(e) => setNewDiaryEntry({ ...newDiaryEntry, note: e.target.value })}
                    placeholder="예: 새 토너 사용, 피부가 촉촉해요"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    rows="4"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 사용한 제품, 피부 상태, 날씨 등을 기록해보세요
                  </p>
                </div>

                {/* 저장 버튼 */}
                <button
                  onClick={handleAddDiaryEntry}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  기록 저장하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 채팅봇 모달 */}
        {showChatbot && (
          <Chatbot
            skinType={result}
            onClose={() => setShowChatbot(false)}
          />
        )}
      </>
    );
  }

  // 질문 화면
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{currentQuestion + 1}/{questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight whitespace-pre-line">
            {question.question}
          </h2>
        </div>

        {/* 5점 척도 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-gray-500">전혀 아니다</span>
            <span className="text-xs text-gray-500">매우 그렇다</span>
          </div>
          <div className="flex gap-2 justify-between">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => handleScoreSelect(score)}
                className={`flex-1 aspect-square rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                  selectedScore === score
                    ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <span className={`text-2xl font-bold ${
                  selectedScore === score ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {score}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 이전/다음 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex-1 py-4 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              currentQuestion === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            이전
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`flex-1 py-4 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              canGoNext
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestion === questions.length - 1 ? '결과 보기' : '다음'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
