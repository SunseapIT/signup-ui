import { TokenizationModule } from './tokenization.module';

describe('TokenizationModule', () => {
  let tokenizationModule: TokenizationModule;

  beforeEach(() => {
    tokenizationModule = new TokenizationModule();
  });

  it('should create an instance', () => {
    expect(tokenizationModule).toBeTruthy();
  });
});
