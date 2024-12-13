import 'package:cat/landing_page.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'homepage.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    // Replace with actual values
    options: FirebaseOptions(
      apiKey: "YOUR_API_KEY",
      appId: "YOUR_APP_ID",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      projectId: "YOUR_PROJECT_ID",
    ),
  );
  runApp(ProviderScope(child: StudyBeeApp()));
}

class StudyBeeApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Color(0xFFEFF2FF),
        primaryColor: Color(0xFF5661F6),
        hintColor: Color(0xFF627EEE),
        textTheme: TextTheme(
          bodyLarge: TextStyle(color: Colors.white, fontSize: 16),
          bodyMedium: TextStyle(color: Colors.white70),
          displayLarge: TextStyle(
              color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
          titleLarge: TextStyle(color: Colors.white, fontSize: 20),
        ),
        iconTheme: IconThemeData(color: Colors.white70),
      ),
      home: LandingPage(),
    );
  }
}
