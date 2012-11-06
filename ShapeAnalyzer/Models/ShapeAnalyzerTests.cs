using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShapeAnalyzer.Models
{
    public class ShapeAnalyzerTests
    {
        public IEnumerable<ShapeAnalyzerTestCircle> RandomCircles { get; set; }

        public IEnumerable<ShapeAnalyzerTestCircle> PathalogicalCircles { get; set; }

        public IEnumerable<ShapeAnalyzerTestCircle> BrokenCircles { get; set; }
    }
}