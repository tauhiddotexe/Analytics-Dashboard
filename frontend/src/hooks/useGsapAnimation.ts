export function useGsapAnimation() {
  const noop = () => {};
  return { animateEntrance: noop, animateStagger: noop, animateCounters: noop };
}
