using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;

namespace ShapeAnalyzer.App_Start
{
    public static class CircleImageGenerator
    {
        public static Stream GetCircleImageStream(int centerX, int centerY, int width)
        {
            var rx = new Random();
            var maxRadius = Math.Min(centerX, centerY);
            var radius = rx.Next(1, maxRadius);
            var x = centerX - radius;
            var y = centerY - radius;

            using (var bitmap = new Bitmap(width, width))
            {
                using (var g = Graphics.FromImage(bitmap))
                {
                    g.FillRectangle(Brushes.White, 0, 0, width, width);
                    g.FillEllipse(Brushes.Black, x, y, radius * 2, radius * 2);
                }

                var stream = new MemoryStream();
                bitmap.Save(stream, ImageFormat.Png);
                stream.Position = 0;
                return stream;
            }
        }
    }
}