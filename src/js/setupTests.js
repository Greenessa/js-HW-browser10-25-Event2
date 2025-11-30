global.document = {

    createElement: () => ({ 
  
      classList: { add: jest.fn() },
  
      appendChild: jest.fn()
  
    }),
  
    querySelector: jest.fn(() => ({
  
      appendChild: jest.fn()
  
    })),
  
    querySelectorAll: jest.fn(() => [])
  
  };