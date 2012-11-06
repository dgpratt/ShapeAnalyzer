using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShapeAnalyzer.App_Start;
using ShapeAnalyzer.Models;

namespace ShapeAnalyzer.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        public ViewResult TestCases()
        {
            var model = new ShapeAnalyzerTests
            {
                RandomCircles = GetRandomCircleTestCases(),
                PathalogicalCircles = GetPathologicalCircleTestCases(),
                BrokenCircles = GetBrokenCircleTestCases(),
            };

            return View(model);            
        }

        public ViewResult ManualTest(string imageUrl)
        {
            ViewBag.ImageUrl = imageUrl;

            return View();
        }

        private IEnumerable<ShapeAnalyzerTestCircle> GetBrokenCircleTestCases()
        {
            var random = new Random();

            var brokenCircles =
                from c in Enumerable.Range(0, 10)
                let randomX = random.Next(1, 50)
                let randomY = random.Next(1, 50)
                let wiggleX = random.Next(3, 10)
                let wiggleY = random.Next(3, 10)
                select new Models.ShapeAnalyzerTestCircle
                           {
                               CenterX = randomX - wiggleX,
                               CenterY = randomY - wiggleY,
                               Url = Url.Action("RandomizedCircleImage", new {centerX = randomX, centerY = randomY}),
                           };
            return brokenCircles;
        }

        private IEnumerable<ShapeAnalyzerTestCircle> GetRandomCircleTestCases()
        {
            var random = new Random();

            var randomCircles =
                from c in Enumerable.Range(0, 10)
                let randomX = random.Next(1, 50)
                let randomY = random.Next(1, 50)
                select new Models.ShapeAnalyzerTestCircle
                           {
                               CenterX = randomX,
                               CenterY = randomY,
                               Url = Url.Action("RandomizedCircleImage", new {centerX = randomX, centerY = randomY}),
                           };
            return randomCircles;
        }

        private IEnumerable<ShapeAnalyzerTestCircle> GetPathologicalCircleTestCases()
        {
            return new[]
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
        }

        public FileStreamResult RandomizedCircleImage(int centerX, int centerY, int? width)
        {
            var imageStream = CircleImageGenerator.GetCircleImageStream(centerX, centerY, width ?? 100);
            return File(imageStream, "image/png");
        }
    }
}
