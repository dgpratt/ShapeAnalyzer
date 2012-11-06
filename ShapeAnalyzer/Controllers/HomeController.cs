using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShapeAnalyzer.App_Start;

namespace ShapeAnalyzer.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            var r = new Random();

            var randomCircles =
                from c in Enumerable.Range(0, 10)
                let randomX = r.Next(1, 50)
                let randomY = r.Next(1, 50)
                select new Models.ShapeAnalyzerTestCircle
                           {
                               CenterX = randomX,
                               CenterY = randomY,
                               Url = Url.Action("RandomizedCircleImage", new { centerX = randomX, centerY = randomY }),
                           };

            var badCircles = new[]
                                 {
                                     new Models.ShapeAnalyzerTestCircle
                                         {
                                             CenterX = 1,
                                             CenterY = 1,
                                             Url = Url.Content("~/Content/images/bad-circle-1.png"),
                                         },
                                     new Models.ShapeAnalyzerTestCircle
                                         {
                                             CenterX = 99,
                                             CenterY = 1,
                                             Url = Url.Content("~/Content/images/bad-circle-2.png"),
                                         },
                                     new Models.ShapeAnalyzerTestCircle
                                         {
                                             CenterX = 1,
                                             CenterY = 99,
                                             Url = Url.Content("~/Content/images/bad-circle-3.png"),
                                         },
                                     new Models.ShapeAnalyzerTestCircle
                                         {
                                             CenterX = 99,
                                             CenterY = 99,
                                             Url = Url.Content("~/Content/images/bad-circle-4.png"),
                                         },
                                 };

            var brokenCircles =
                from c in Enumerable.Range(0, 10)
                let randomX = r.Next(1, 50)
                let randomY = r.Next(1, 50)
                let wiggleX = r.Next(3, 10)
                let wiggleY = r.Next(3, 10)
                select new Models.ShapeAnalyzerTestCircle
                {
                    CenterX = randomX - wiggleX,
                    CenterY = randomY - wiggleY,
                    Url = Url.Action("RandomizedCircleImage", new { centerX = randomX, centerY = randomY }),
                };


            var model = new Models.ShapeAnalyzerTests
                            {
                                RandomCircles = randomCircles,
                                PathalogicalCircles = badCircles,
                                BrokenCircles = brokenCircles,
                            };

            return View(model);
        }

        public FileStreamResult RandomizedCircleImage(int centerX, int centerY, int? width)
        {
            var imageStream = CircleImageGenerator.GetCircleImageStream(centerX, centerY, width ?? 100);
            return File(imageStream, "image/png");
        }
    }
}
