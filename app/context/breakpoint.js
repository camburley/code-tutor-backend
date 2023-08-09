const breakpoint = [
    {"breakpoint.js" : `
    const defaultValue = {};

    const BreakpointContext = createContext(defaultValue);
    
    const BreakpointProvider = ({ children, queries }) => {
      const [queryMatch, setQueryMatch] = useState({});
    
      useEffect(() => {
        const mediaQueryLists = {};
        const keys = Object.keys(queries);
        let isAttached = false;
    
        const handleQueryListener = () => {
          const updMatches = keys.reduce((acc, media) => {
            acc[media] = !!(
              mediaQueryLists[media] && mediaQueryLists[media].matches
            );
            return acc;
          }, {});
          setQueryMatch(updMatches);
        };
    
        if (window && window.matchMedia) {
          const matches = {};
          keys.forEach(media => {
            if (typeof queries[media] === 'string') {
              mediaQueryLists[media] = window.matchMedia(queries[media]);
              matches[media] = mediaQueryLists[media].matches;
            } else {
              matches[media] = false;
            }
          });
          setQueryMatch(matches);
          isAttached = true;
          keys.forEach(media => {
            if (typeof queries[media] === 'string') {
              mediaQueryLists[media].addListener(handleQueryListener);
            }
          });
        }
    
        return () => {
          if (isAttached) {
            keys.forEach(media => {
              if (typeof queries[media] === 'string') {
                mediaQueryLists[media].removeListener(handleQueryListener);
              }
            });
          }
        };
      }, [queries]);
    
      return (
        <BreakpointContext.Provider value={queryMatch}>
          {children}
        </BreakpointContext.Provider>
      );
    };
    
    function useBreakpoint() {
      const context = useContext(BreakpointContext);
      if (context === defaultValue) {
        throw new Error('useBreakpoint must be used within BreakpointProvider');
      }
      return context;
    }
    export { useBreakpoint, BreakpointProvider };
    `}
]

module.exports = breakpoint;