import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "../app.js";
import { assertNotMatch, assertEquals, assertMatch, assertThrowsAsync, assertArrayIncludes } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import * as services from '../services/wellBoingServices.js';

Deno.test({
    name: "User directed to general landing page before if not authenticated.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/")
        assertArrayIncludes(response.text, '<h1 class="display-3 text-center font-weight-bold">WellBoing</h1>');
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });

Deno.test({
    name: "Testing security: Summary page is not accessible without authentication, but redirects to general maing page.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/behaviour/summary").expect(200);
        assertArrayIncludes(response.text, '<h1 class="text-center">Well-come to</h1>');
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });

Deno.test({
    name: "Reporting morning activity is not possible witout authentication",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/report/morning")
        .send({"morningDate":"11-11-2011",
                "sleepohurs": 6,
                "morningMood": 3,
    }).expect(404);
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });

Deno.test({
    name: "Reporting evening activity is not possible witout authentication",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/report/evening")
        .send({"eveningDate":"11-11-2011",
                "sportHours": 6,
                "studyHours": 3,
                "eatingRegularity": 3,
                "eatingQuality": 3,
                "eveningMood": 3
    }).expect(404);
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });

Deno.test({
    name: "User setup: Registering (with valid information).",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/auth/register")
        .send('email=nakki1192874917289719@hotmail.com&password=password&verification=assword').expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "User setup: Logging out (with the previous information).",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/auth/logout")
            .expect(200);
        assertArrayIncludes(response.text, '<h1 class="text-center">Well-come to</h1>');
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "The user knows about the cookies, and the site is somewhat legal.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/")
        assertArrayIncludes(response.text, 'This site uses its own cookies to provide the service it is meant for. By continuing to use this site you give your acceptance.');
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });

Deno.test({
    name: "API: from /api/summary a JSON-file is returned.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/api/summary")
            .expect(200)
            .expect('Content-Type', new RegExp('application/json'))
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "API: from /api/summary/:year/:month/:day a JSON-file is returned.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/api/summary/2020/10/09")
            .expect(200)
            .expect('Content-Type', new RegExp('application/json'))
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Security: Morning reporting functionality unavailable for unauthenticated users.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/report/morning")
            .expect(200)
        assertArrayIncludes(response.text, '<h1 class="text-center">Well-come to</h1>');
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Security: Evening reporting functionality unavailable for unauthenticated users.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/report/evening")
            .expect(200)
        assertArrayIncludes(response.text, '<h1 class="text-center">Well-come to</h1>');
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Security: Morning report does not accept entries from unauthenticated sessions.",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/report/morning")
            .expect(404);
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Security: Evening report does not accept entries from unaauthenticated sessions.",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/report/evening")
            .expect(404);
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Security: User homepage unavailable for unauthenticated users.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/home")
            .expect(200)
        assertArrayIncludes(response.text, '<h1 class="text-center">Well-come to</h1>');
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Security: User summary page unavailable for unauthenticated users.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/behavior/summary")
            .expect(200)
        assertArrayIncludes(response.text, '<h1 class="text-center">Well-come to</h1>');
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Security: /behavior/reporting unavailable for unauthenticated users.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/behavior/reporting")
            .expect(200)
        assertArrayIncludes(response.text, '<h1 class="text-center">Well-come to</h1>');
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Usability: Login page accessable from landing page.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/")
            .expect(200)
        assertArrayIncludes(response.text, '<a href="/auth/login" class="btn btn-outline-primary m-1">Login</a>');
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Usability: Register page accessable from landing page.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/")
            .expect(200)
        assertArrayIncludes(response.text, '<a href="/auth/register" class="btn btn-outline-success m-1">Register</a>');
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Usability: Login page allows the input of email and password.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/auth/login")
            .expect(200)
        assertArrayIncludes(response.text, '<input type="email"');
        assertArrayIncludes(response.text, '<input type="password"');
    },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "Usability: Register page allows the input of email and password and verification for password.",
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.get("/auth/login")
            .expect(200)
        assertArrayIncludes(response.text, '<input type="email"');
        assertArrayIncludes(response.text, '<input type="password"');
        assertArrayIncludes(response.text, '<name="verification"');
    },
        sanitizeResources: false,
        sanitizeOps: false,
});





