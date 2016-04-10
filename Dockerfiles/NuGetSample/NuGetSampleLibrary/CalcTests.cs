using NuGetSample;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NuGetSampleLibrary
{
    [TestFixture]
    public class Tests
    {
        [Test]
        public void ProductOf_Positives_Test()
        {
            Assert.AreEqual(25, new Calc().Multiply(5, 5));
        }

        [Test]
        public void ProductOf_Negatives_Test()
        {
            Assert.AreEqual(25, new Calc().Multiply(-5, -5));
        }
    }
}
