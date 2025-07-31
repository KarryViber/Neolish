export interface PasswordStrengthResult {
  score: number; // 0-4 (0=veryWeak, 1=weak, 2=fair, 3=strong, 4=veryStrong)
  feedbackKeys: string[]; // Keys for i18n translation
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    noCommonPasswords: boolean;
  };
}

// 常见弱密码列表和简单模式
const COMMON_PASSWORDS = [
  '123456', 'password', '123456789', '12345678', '12345', '1234567', 
  '1234567890', 'qwerty', 'abc123', 'million2', '000000', 'daniel',
  'qwertyuiop', '123123', '1q2w3e4r', 'admin', 'letmein', 'welcome',
  'monkey', 'dragon', '111111', '654321', 'master', 'hello',
  'aaaaaa', '1qaz2wsx', '123qwe', 'zxcvbnm', '121212', 'asdasd',
  '123', '1234', 'abc', 'aaa', 'bbb', 'ccc', '000', '999'
];

// 检查是否为简单重复或连续字符
function isSimplePattern(password: string): boolean {
  if (password.length < 3) return true;
  
  // 检查重复字符 (如 "aaa", "111")
  const allSame = password.split('').every(char => char === password[0]);
  if (allSame) return true;
  
  // 检查连续数字 (如 "123", "456")
  const isConsecutiveNumbers = /^(?:0123456789|1234567890|2345678901|3456789012|4567890123|5678901234|6789012345|7890123456|8901234567|9012345678){1,}/.test(password);
  if (isConsecutiveNumbers) return true;
  
  // 检查连续字母 (如 "abc", "def")
  const chars = password.toLowerCase();
  let isConsecutive = true;
  for (let i = 1; i < chars.length; i++) {
    if (chars.charCodeAt(i) !== chars.charCodeAt(i-1) + 1) {
      isConsecutive = false;
      break;
    }
  }
  
  return isConsecutive;
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const feedbackKeys: string[] = [];
  
  // 如果密码为空，返回最低分数
  if (!password) {
    return {
      score: 0,
      feedbackKeys: ['addLength'],
      isValid: false,
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumbers: false,
        hasSpecialChars: false,
        noCommonPasswords: false
      }
    };
  }
  
  // 检查各项要求
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noCommonPasswords: !COMMON_PASSWORDS.includes(password.toLowerCase()) && !isSimplePattern(password)
  };

  // 根据未满足的要求生成反馈键
  if (!requirements.minLength) {
    feedbackKeys.push('addLength');
  }
  if (!requirements.hasUppercase) {
    feedbackKeys.push('addUppercase');
  }
  if (!requirements.hasLowercase) {
    feedbackKeys.push('addLowercase');
  }
  if (!requirements.hasNumbers) {
    feedbackKeys.push('addNumbers');
  }
  if (!requirements.hasSpecialChars) {
    feedbackKeys.push('addSpecialChars');
  }
  if (!requirements.noCommonPasswords) {
    feedbackKeys.push('avoidCommon');
  }

  // 重新设计的分数计算逻辑
  let score = 0;
  
  // 如果是简单模式或常见密码，直接给最低分
  if (isSimplePattern(password) || COMMON_PASSWORDS.includes(password.toLowerCase())) {
    score = 0;
  } else {
    // 计算满足的要求数量
    const passedRequirements = Object.values(requirements).filter(Boolean).length;
    
    // 根据满足的要求数量计算基础分数
    if (passedRequirements <= 1) score = 0;      // 很弱
    else if (passedRequirements === 2) score = 1; // 弱
    else if (passedRequirements === 3) score = 1; // 弱
    else if (passedRequirements === 4) score = 2; // 一般
    else if (passedRequirements === 5) score = 3; // 强
    else if (passedRequirements === 6) score = 4; // 很强
    
    // 长度奖励
    if (password.length >= 12 && score >= 2) score = Math.min(score + 1, 4);
    if (password.length >= 16 && score >= 3) score = Math.min(score + 1, 4);
    
    // 复杂度检查 - 更严格
    const uniqueChars = new Set(password).size;
    const uniqueRatio = uniqueChars / password.length;
    if (uniqueRatio < 0.5 && score > 1) score = Math.max(score - 1, 1); // 降低重复字符多的密码分数
  }

  // 如果密码很强，给出正面反馈
  if (score >= 3 && feedbackKeys.length === 0) {
    feedbackKeys.push(score >= 4 ? 'excellentStrength' : 'goodStrength');
  }

  // 判断是否有效 (至少满足基本要求)
  const isValid = requirements.minLength && 
                   requirements.hasUppercase && 
                   requirements.hasLowercase && 
                   requirements.hasNumbers && 
                   requirements.noCommonPasswords;

  return {
    score,
    feedbackKeys,
    isValid,
    requirements
  };
}

export function getPasswordStrengthText(score: number): string {
  switch (score) {
    case 0: return 'Very Weak';
    case 1: return 'Weak';
    case 2: return 'Fair';
    case 3: return 'Strong';
    case 4: return 'Very Strong';
    default: return 'Very Weak';
  }
}

export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0: return 'text-red-600';
    case 1: return 'text-red-500';
    case 2: return 'text-yellow-500';
    case 3: return 'text-blue-500';
    case 4: return 'text-green-500';
    default: return 'text-red-600';
  }
}

export function getPasswordStrengthBgColor(score: number): string {
  switch (score) {
    case 0: return 'bg-red-500';
    case 1: return 'bg-red-400';
    case 2: return 'bg-yellow-400';
    case 3: return 'bg-blue-500';
    case 4: return 'bg-green-500';
    default: return 'bg-red-500';
  }
} 