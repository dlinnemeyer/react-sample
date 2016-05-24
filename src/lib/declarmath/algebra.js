function terms(ex){ return ex.terms.map(function(term){ return term.variables.map(function(vari){ return vari.variable; }); }); }
