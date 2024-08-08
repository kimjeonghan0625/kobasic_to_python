# KoBasic to Python Transpiler(High-level compiler)

## 개요

이 프로젝트는 KoBasic(Applesoft Basic의 한국어 버전) 코드를 Python 코드로 변환하는 트랜스파일러를 구현하고 있습니다. KoBasic 코드를 AST로 변환하는 parser와 AST를 파이썬 코드로 변환하는 code-generator 를 포함하고 있습니다. 브라우저, 서버 환경에 쉽게 적용이 가능하도록 자바스크립트로 작성되었습니다.

## 클래스 및 메서드 API
### `PyCodeGen`
- KoBasic AST를 Python 문자열로 변환하는 기능을 합니다. 
- src/codegen/py-code-gen.js 에 위치해 있습니다.
- src/parser/kob-parser.js에 의존하고 있습니다.
#### 메서드 API
`compile(kobCode)`

이 메서드는 KoBasic 코드를 받아 Python 코드를 반환합니다.
- 매개변수
  - `kobCode` (string): 변환하려 하는 KoBasic 코드 문자열
- 반환값
  - (string): 변환된 파이썬 코드

## KoBasic 문법
아래 표시된 한글 키워드를 사용하여 KoBasic코드를 작성할 수 있습니다. <제약사항>에 작성된 내용을 제외하고 Applesoft Basic과 동일한 문법을 따르고 있습니다.
- [x]  PRINT 출력
- [x]  END 끝
- [x]  REM 주석
- [x]  LET 할당 (예시 -> "10 할당 변수1 = 3")
- [x]  INPUT 입력
- [x]  GOSUB 서브
- [x]  RETURN 반환
- [x]  GOTO 이동
- [x]  DIM 배열
- [x]  IF 만약 THEN 참이면
- [x]  FOR 반복 TO 까지 NEXT 다음 STEP 증가분 or 단계
- [x]  변수이름 한글사용 가능
- [x]  AND 이고
- [x]  OR 또는
- [x]  NOT 아니다

## 테스트 코드
kobasic_to_python 트랜스파일러를 테스트해볼 수 있는 테스트 코드를 첨부합니다. KoBasic 문법에 따라 작성되었습니다.
``` txt
-- 서브, 반환, 출력, 입력, 주석, 할당 등을 포함한 테스트코드

10 출력 "더할 두 숫자를 입력하라"
20 입력 "첫번째 숫자: "; A
30 입력 "두번째 숫자: "; B
40 서브 1000
50 출력 "두 수의 합은: "; S
60 끝

1000 주석 "서브루틴"
1010 S = A + B
1020 반환


-- step을 포함한 이중반복문 코드

10 반복 I = 1 부터 3 증가분 1
20   반복 J = 1 부터 3 증가분 2
30     출력 "I = "; I; ", J = "; J; ", I * J = "; I * J
40   다음 J
50 다음 I

# 실행결과
I = 1 , J = 1 , I * J = 1
I = 1 , J = 3 , I * J = 3
I = 2 , J = 1 , I * J = 2
I = 2 , J = 3 , I * J = 6
I = 3 , J = 1 , I * J = 3
I = 3 , J = 3 , I * J = 9


-- goto와 if문을 함께 이용하는 코드

10 변1 = 3
20 출력 변1
30 변1 = 변1 + 1
40 만약 변1 < 10 참이면 이동 20

# 실행결과
3
4
5
6
7
8
9
```

## <제약사항>
KoBasic은 Applesoft Basic의 핵심 기능을 우선적으로 구현하고 있습니다. 이에 따라 아직 완벽하게 지원하지 못하는 부분이 존재하며, 이는 향후 개선될 수 있습니다. 다음은 현재 기준 제약사항입니다.
- 내장함수를 지원하지 않습니다. (추후 추가될 수 있음)
- 주석 REM 문법을 사용할 때, 뒤에 STRING이 와야 합니다.
- NEW, ON, RESTORE, STOP, READ 등 일부 문법을 지원하지 않습니다.
  
## 기여
KoBasic에 관심이 있다면 프로젝트를 개선하는 데 참여할 수 있습니다.
이 프로젝트에 기여하려면 다음 단계를 따르세요:

1. 프로젝트를 포크합니다.
2. 새로운 브랜치를 생성합니다 (git checkout -b feature/YourFeature).
3. 변경 사항을 커밋합니다 (git commit -am 'Add new feature').
4. 브랜치에 푸시합니다 (git push origin feature/YourFeature).
5. Pull Request를 생성합니다.