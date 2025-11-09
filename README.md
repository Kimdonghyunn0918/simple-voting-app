# Simple Voting App

A Web3.0 voting app on blockchain with Next.js and Ethers.js, using Sepolia testnet.

## Setup
1. `npm install`
2. Update `src/lib/eth.ts` with contract address and ABI.
3. `npm run dev` for local.

## Deployment
- Deploy contract via Remix to Sepolia.
- GitHub push.
- Vercel deploy.

Student: 92113504김동현

simple-voting-app/  # 프로젝트 루트
├── contracts/      # 스마트 컨트랙트 폴더
│   └── Voting.sol  # Solidity 컨트랙트 파일
├── src/            # 소스 코드 폴더 (Next.js 구조)
│   ├── app/        # Next.js App Router
│   │   └── page.tsx  # 메인 페이지 컴포넌트
│   └── lib/        # 유틸리티 라이브러리
│       └── eth.ts  # Web3 연결 함수들
├── .gitignore      # Git 무시 파일
├── next.config.ts  # Next.js 설정
├── package.json    # 패키지 의존성 및 스크립트
├── postcss.config.mjs  # PostCSS 설정 (Tailwind용)
├── README.md       # 프로젝트 설명 문서
├── tailwind.config.ts  # Tailwind CSS 설정
└── tsconfig.json   # TypeScript 설정
