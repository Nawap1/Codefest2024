import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

import 'homepage.dart';

class LandingPage extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final animationController = useAnimationController(
      duration: const Duration(seconds: 2),
    )..forward();

    final fadeAnimation = useAnimation(
      Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(
          parent: animationController,
          curve: Curves.easeInOut,
        ),
      ),
    );

    return Scaffold(
      body: Container(
        color: Colors.white,
        child: Center(
          child: Container(
            margin: EdgeInsets.all(16),
            padding: EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Color(0xFF5661F6),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 10,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedOpacity(
                  opacity: fadeAnimation,
                  duration: Duration(milliseconds: 800),
                  child: Hero(
                    tag: 'logo',
                    child: Image.asset(
                      'assets/logo.jpeg',
                      width: 120,
                      height: 120,
                    ),
                  ),
                ),
                SizedBox(height: 24),
                AnimatedOpacity(
                  opacity: fadeAnimation,
                  duration: Duration(milliseconds: 800),
                  child: Text(
                    'StudyBee',
                    style: TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 3,
                      shadows: [
                        Shadow(
                          blurRadius: 10.0,
                          color: Colors.black45,
                          offset: Offset(2, 2),
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(height: 16),
                AnimatedOpacity(
                  opacity: fadeAnimation,
                  duration: Duration(milliseconds: 800),
                  child: Text(
                    'Unlock your potential with personalized learning',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.white70,
                      fontStyle: FontStyle.italic,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                SizedBox(height: 24),
                AnimatedOpacity(
                  opacity: fadeAnimation,
                  duration: Duration(milliseconds: 800),
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        PageRouteBuilder(
                          pageBuilder: (context, animation, secondaryAnimation) => HomePage(),
                          transitionsBuilder: (context, animation, secondaryAnimation, child) {
                            return FadeTransition(opacity: animation, child: child);
                          },
                          transitionDuration: Duration(milliseconds: 800),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(horizontal: 40, vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                      elevation: 10,
                      shadowColor: Colors.black45,
                    ),
                    child: Text(
                      'Get Started',
                      style: TextStyle(
                        fontSize: 20,
                        color: Color(0xFF5661F6),
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),
                ),
                SizedBox(height: 16),
                AnimatedOpacity(
                  opacity: fadeAnimation,
                  duration: Duration(milliseconds: 800),
                  child: Text(
                    'Already have an account? ',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white70,
                    ),
                  ),
                ),
                AnimatedOpacity(
                  opacity: fadeAnimation,
                  duration: Duration(milliseconds: 800),
                  child: TextButton(
                    onPressed: () {},
                    child: Text(
                      'Sign In',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
