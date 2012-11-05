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
            return View();
        }

        public FileStreamResult RandomizedCircleImage(int centerX, int centerY, int? width)
        {
            var imageStream = CircleImageGenerator.GetCircleImageStream(centerX, centerY, width ?? 100);
            return File(imageStream, "image/png");
        }
    }
}
