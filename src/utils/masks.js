export const MASKS = {
  telefone: {
    mask: [
      { mask: '(00) 0000-0000' },
      { mask: '(00) 00000-0000' },
    ],
  },

  cnh: {
    mask: '00000000000',
  },

  
  placa: {
    mask: 'AAA0A00',
    definitions: {
      'A': /[A-Z]/,
      '0': /[0-9]/,
    },
    prepare: (str) => str.toUpperCase(),
  },

  cpf: {
    mask: '000.000.000-00',
  },

  cnpj: {
    mask: '00.000.000/0000-00',
  },

  cep: {
    mask: '00000-00',
  },

  capacidade: {
    mask: Number,
    min: 1,
    max: 50, 
    scale: 0,
  },

  moeda: {
    mask: 'R$ num',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: '.',
        radix: ',',
        scale: 2,
        padFractionalZeros: true,
      },
    },
  },
};