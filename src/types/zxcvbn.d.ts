declare module 'zxcvbn' {
  interface ZXCVBNResult {
    score: number;
    guesses: number;
    guesses_log10: number;
    feedback: {
      warning: string;
      suggestions: string[];
    };
  }

  function zxcvbn(password: string, userInputs?: string[]): ZXCVBNResult;

  export = zxcvbn;
}
