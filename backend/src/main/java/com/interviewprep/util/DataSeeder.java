package com.interviewprep.util;

import com.interviewprep.entity.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedQuestions();
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@interviewprep.com")) {
            User admin = new User();
            admin.setFullName("Admin");
            admin.setEmail("admin@interviewprep.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin created: admin@interviewprep.com / Admin@123");
        }
    }

    private void seedQuestions() {
        if (questionRepository.count() > 0) return;

        List<Question> questions = List.of(
            // Technical - Easy
            q("What is OOP?", "OOP is a programming paradigm based on objects. Key concepts: Encapsulation, Inheritance, Polymorphism, Abstraction.", Question.Category.TECHNICAL, Question.Difficulty.EASY, "Java Basics", "oop,object,class,encapsulation,inheritance,polymorphism,abstraction"),
            q("What is a variable?", "A variable is a named storage location in memory that holds a value.", Question.Category.TECHNICAL, Question.Difficulty.EASY, "Programming Basics", "variable,memory,storage,value,datatype"),
            q("What is a loop?", "A loop is a control structure that repeats a block of code while a condition is true.", Question.Category.TECHNICAL, Question.Difficulty.EASY, "Programming Basics", "loop,for,while,iteration,repeat,condition"),
            q("What is an array?", "An array is a data structure that stores a fixed-size collection of elements of the same type.", Question.Category.TECHNICAL, Question.Difficulty.EASY, "Data Structures", "array,index,element,fixed,size,data structure"),
            q("What is an interface in Java?", "An interface is an abstract type used to specify behavior that classes must implement.", Question.Category.TECHNICAL, Question.Difficulty.EASY, "Java Basics", "interface,abstract,implement,contract,method"),

            // Technical - Medium
            q("What is the difference between HashMap and TreeMap?", "HashMap stores key-value pairs with O(1) average access using hashing. TreeMap maintains sorted order with O(log n) access using a Red-Black tree.", Question.Category.TECHNICAL, Question.Difficulty.MEDIUM, "Java Collections", "hashmap,treemap,sorted,hashing,collections,map,key,value"),
            q("Explain the SOLID principles.", "SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.", Question.Category.TECHNICAL, Question.Difficulty.MEDIUM, "Design Principles", "solid,single,open,closed,liskov,interface,dependency,principle"),
            q("What is REST API?", "REST is an architectural style using HTTP methods (GET, POST, PUT, DELETE) for stateless communication between client and server.", Question.Category.TECHNICAL, Question.Difficulty.MEDIUM, "Web Development", "rest,api,http,get,post,put,delete,stateless,endpoint"),
            q("What is Spring Boot?", "Spring Boot is a framework that simplifies Spring application development with auto-configuration, embedded servers, and opinionated defaults.", Question.Category.TECHNICAL, Question.Difficulty.MEDIUM, "Spring Framework", "spring,boot,autoconfiguration,embedded,server,starter,framework"),
            q("What is SQL JOIN?", "JOIN combines rows from two or more tables based on a related column. Types: INNER, LEFT, RIGHT, FULL OUTER.", Question.Category.TECHNICAL, Question.Difficulty.MEDIUM, "Database", "join,inner,left,right,outer,table,sql,relation"),

            // Technical - Hard
            q("Explain microservices architecture.", "Microservices is an architectural style where an application is divided into small, independent services that communicate via APIs.", Question.Category.TECHNICAL, Question.Difficulty.HARD, "Architecture", "microservices,service,api,independent,docker,kubernetes,scalable"),
            q("What is JVM memory model?", "JVM memory includes Heap (objects), Stack (method calls), Method Area (class metadata), and native memory.", Question.Category.TECHNICAL, Question.Difficulty.HARD, "Java Advanced", "jvm,heap,stack,memory,garbage,collection,metaspace,thread"),
            q("Explain CAP theorem.", "CAP: A distributed system can only guarantee two of three: Consistency, Availability, Partition Tolerance.", Question.Category.TECHNICAL, Question.Difficulty.HARD, "Distributed Systems", "cap,consistency,availability,partition,distributed,theorem"),

            // HR - Easy
            q("Tell me about yourself.", "Start with education, mention key skills, relevant experience, and what you're looking to achieve.", Question.Category.HR, Question.Difficulty.EASY, "Introduction", "experience,skills,education,goal,background,professional,strength"),
            q("Why do you want this job?", "Express passion for the role, align your skills with the position, and mention how it fits your career goals.", Question.Category.HR, Question.Difficulty.EASY, "Motivation", "passion,skills,goal,career,growth,contribute,company,fit"),

            // HR - Medium
            q("What is your greatest weakness?", "Mention a real weakness, explain steps you're taking to improve, and show self-awareness.", Question.Category.HR, Question.Difficulty.MEDIUM, "Self Assessment", "weakness,improve,learning,self,aware,working,growth"),
            q("Where do you see yourself in 5 years?", "Discuss career growth goals, how you plan to develop skills, and your long-term vision aligned with the company.", Question.Category.HR, Question.Difficulty.MEDIUM, "Career Goals", "goal,career,growth,future,vision,skill,development,leadership"),
            q("Describe a challenging situation you handled.", "Use the STAR method: Situation, Task, Action, Result. Show problem-solving and resilience.", Question.Category.HR, Question.Difficulty.MEDIUM, "Behavioral", "challenge,situation,task,action,result,problem,solve,team"),

            // HR - Hard
            q("How do you handle conflict in a team?", "Describe active listening, staying calm, finding common ground, and focusing on the problem not the person.", Question.Category.HR, Question.Difficulty.HARD, "Teamwork", "conflict,team,listen,resolve,communicate,empathy,solution,professional"),
            q("Why should we hire you?", "Highlight unique skills, relevant experience, proven track record, and your enthusiasm to contribute to the company's success.", Question.Category.HR, Question.Difficulty.HARD, "Persuasion", "skill,experience,value,contribute,achieve,unique,result,team,company"),

            // Behavioral - Medium
            q("Give an example of a time you showed leadership.", "Describe a situation where you took initiative, guided a team, made decisions, and achieved results.", Question.Category.BEHAVIORAL, Question.Difficulty.MEDIUM, "Leadership", "leadership,initiative,team,decision,guide,result,responsibility"),
            q("Describe a time you failed and what you learned.", "Be honest about a failure, focus on the lesson learned, and explain how it made you better.", Question.Category.BEHAVIORAL, Question.Difficulty.MEDIUM, "Learning", "fail,learn,improve,mistake,reflect,grow,experience,outcome")
        );

        questionRepository.saveAll(questions);
        System.out.println("Seeded " + questions.size() + " questions.");
    }

    private Question q(String text, String answer, Question.Category cat, Question.Difficulty diff, String topic, String keywords) {
        Question q = new Question();
        q.setQuestionText(text);
        q.setExpectedAnswer(answer);
        q.setCategory(cat);
        q.setDifficulty(diff);
        q.setTopic(topic);
        q.setKeywords(keywords);
        return q;
    }
}
