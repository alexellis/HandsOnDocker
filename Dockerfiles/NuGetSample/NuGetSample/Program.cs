using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NuGetSample
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 2)
            {
                Console.Error.WriteLine("Usage: product x y");
                return;
            }

            int val = new Calc().Multiply(int.Parse(args[0]), int.Parse(args[1]));
            Console.WriteLine("Product: {0}.", val);
        }
    }
}
