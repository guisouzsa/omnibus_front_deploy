// hooks/useMask.js
import { useEffect, useRef } from 'react';
import IMask from 'imask';

/**
 * Hook que aplica uma máscara iMask num input via ref.
 *
 * Uso:
 *   const telefoneRef = useMask(MASKS.telefone, handleChange);
 *   <input ref={telefoneRef} name="telefone" ... />
 */
export function useMask(maskOptions, onChange) {
  const ref     = useRef(null);
  const maskRef = useRef(null);

  useEffect(() => {
    if (!ref.current || !maskOptions) return;

    maskRef.current = IMask(ref.current, maskOptions);

    maskRef.current.on('accept', () => {
      // Simula o evento onChange do React com o valor já mascarado
      onChange?.({
        target: {
          name:  ref.current.name,
          value: maskRef.current.value,
        },
      });
    });

    return () => {
      maskRef.current?.destroy();
    };
  }, []);

  // Quando o valor externo muda (ex: carregar dados de edição), sincroniza a máscara
  const syncValue = (value) => {
    if (maskRef.current && value !== undefined) {
      maskRef.current.unmaskedValue = value;
    }
  };

  return { ref, syncValue };
}