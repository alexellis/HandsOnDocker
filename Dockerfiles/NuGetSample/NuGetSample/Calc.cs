using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NuGetSample
{
    public
    class Calc
    {
        public int Multiply(int x, int y)
        {
            int acc = 0;
            for (int i = 0; i < x; i++)
            {
                acc = Sum(acc, y);
            }
            return acc;
        }

        public int Sum(int x, int y)
        {
            return x + y;
        }
    }
}
